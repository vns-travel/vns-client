# VNS Booking Flows — Business Logic Reference

---

## Shared Pre-Booking Sequence (All Service Types)

### 1. Voucher Validation (optional, before booking creation)
- Validate: not expired, under maxUsage, correct serviceType, belongs to user if not public
- Check minimumAmount — voucher discount can never exceed order value
- Return discountAmount + terms for frontend display

### 2. Redis Lock
- Tour:     `lock:tour_schedule:{scheduleId}`
- Homestay: `lock:room:{roomId}:{date}` — one lock per date in range
- Car:      `lock:vehicle:{vehicleId}:{rentalStartDate}`
- TTL: 15 seconds. On failure → 409 "Service temporarily unavailable, try again"

### 3. Availability Check (inside lock)
- Tour: `TourSchedule.availableSlots >= participants`
- Homestay: all room_availability rows in date range exist and are open
- Car: no overlapping confirmed booking for this vehicle + time window

### 4. PostgreSQL Transaction
1. INSERT bookings (status=Pending=1, paymentStatus=Pending=1)
2. INSERT booking_items (links to service/schedule/room/vehicle)
3. INSERT payments (status=Pending, amount=finalAmount)
4. DECREMENT availability (slots / availability rows / vehicle window)
5. Mark voucher used (increment voucherUsages)

### 5. Release Lock

### 6. Payment Gateway
- Create ZaloPay/PayOS order using bookingId + finalAmount
- Store transaction reference on payments row
- Booking stays Pending until callback arrives

---

## Payment Callback Handler

```
SUCCESS:
  payments.status         → Completed(2)
  bookings.paymentStatus  → Completed
  bookings.bookingStatus  → Confirmed(2)
  Notify user: "Booking confirmed!"
  Notify partner: "New booking received"

FAILURE:
  bookings.bookingStatus  → Cancelled(5)
  REVERSE availability decrement
  DECREMENT voucherUsages back
  payments.status         → Failed(3)
```

Always check idempotency — if callback arrives for an already-Confirmed booking, ignore it.

---

## Tour

### Partner Creates a Tour
- Tour entity: title, description, cancellationPolicy, meetingPoint
- Itinerary: stepOrder, location, activity, durationMinutes (renders as visual timeline for users)
- Schedules (each departure): tourDate, startTime, endTime, availableSlots, price, guideId

### Pricing
- Backend computes: `TourSchedule.price × participants`
- Frontend sends `originalAmount = 0`, backend fills it in
- Voucher discount applied after backend price calculation

### After Booking
- Partner sees: customer name, pickup location, pickup time, participant count
- 24h before tour: push driver/guide contact to user
- Day after tour date: cron auto-transitions Confirmed → Completed → unlocks review

---

## Homestay

### Partner Creates a Homestay
- Property: title, address, checkInTime, checkOutTime, houseRules, cancellationPolicy
- Rooms: roomType, capacity, bedConfig, amenities, basePricePerNight
- Availability calendar: one `room_availability` row per room per date with pricePerNight
  - Partners set dynamic pricing per night via bulk endpoint

### Pricing
- Backend sums `price_per_night` across all dates in range
- Adds cleaningFee + serviceFee from the ROOM record (not from user input — never trust frontend for fees)
- Frontend displays breakdown: `2 nights × 850,000₫ + cleaning 100,000₫ + service 50,000₫`

### hostApprovalRequired
- FALSE → instant confirmation on payment success
- TRUE  → payment pre-authorized (not captured), partner has 24h to approve/deny
  - Approve → capture payment → Confirmed
  - Deny or timeout → void auth → Cancelled → notify user

### Deposit Payments
- Track as separate payment rows: type="deposit" (captured now), type="balance" (due on checkIn)

### Auto Status Transitions (cron)
- checkInDate arrives  → Confirmed → InProgress
- checkOutDate passes  → InProgress → Completed
- Completed status unlocks review for this user + booking

---

## Car Rental

### Partner Creates a Vehicle
- Vehicle: make, model, year, type (sedan/SUV/van), capacity, photos
- pricingModel field: "daily" or "hourly" — must be explicit, not inferred
- driverIncluded: boolean, changes required booking fields
- Included items stored as array: ["fuel", "insurance", "driver", "child_seat"]
- Availability: time windows per day (e.g. 08:00–20:00); partner blocks dates for maintenance

### Pricing
- Daily: count calendar days rentalStartDate → rentalEndDate × dailyRate
- Hourly: duration in hours × hourlyRate
- Pricing model is on the vehicle record — backend calculates, frontend doesn't decide

### Driver Flow
- driverIncluded=true: partner assigns driverName + driverPhone before rental day
  - User receives driver contact 24h before pickup via push notification
- driverIncluded=false: user must upload driver's license at booking or on arrival

### Security Deposit
- Separate payment row type="security_deposit" — held, not transferred to partner
- "Close Rental" action on partner side triggers one of:
  - Full refund (no damage)
  - Partial refund (damage amount deducted)
  - Dispute (platform mediates)
- Partner has 72h post-rental to file damage claim before auto-refund fires

---

## Combo

### What It Is
- Partner bundles 2+ of their own approved services with sequenceOrder
- discountedPrice must be < originalPrice (enforced on creation + manager approval)
- Manager must approve before it goes live

### Booking a Combo (bookingType=1)
- Frontend collects per-component dates (homestay checkIn/out, tour schedule, etc.)
- Backend validates ALL components available before acquiring any lock
- If any component fails → entire booking fails (no partial combos)
- Lock all components simultaneously, then single transaction for all inserts

---

## Revenue Split (Every Booking)

Every payment row must store:
- `grossAmount`         → what user paid
- `platformFeeAmount`   → VNS cut (% stored on service record)
- `partnerPayoutAmount` → grossAmount − platformFeeAmount

Feeds: manager revenue dashboard, partner earnings view, monthly reports.

---

## Required Cron Jobs

| Job | Schedule | Action |
|-----|----------|--------|
| Auto-cancel unpaid bookings | Every 5 min | Pending bookings >15min unpaid → Cancelled, restore inventory |
| Auto InProgress (homestay) | Daily midnight | checkInDate = today, status Confirmed → InProgress |
| Auto Complete (homestay) | Daily midnight | checkOutDate = yesterday, InProgress → Completed |
| Auto Complete (tour) | Daily midnight | tourDate = yesterday, Confirmed → Completed |
| Driver/guide reminder | Daily 9am | Bookings tomorrow → push driver/guide contact to user |

All cron jobs must: log start/end, catch errors without crashing, be idempotent, process in batches of max 100 rows.
