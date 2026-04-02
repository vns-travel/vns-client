# VNS Service Data Logic — Complete Reference

This file defines the real-world business logic behind all three service types.
Claude Code must read this file before implementing any service creation, booking,
availability, or management feature.

---

## SYSTEM-WIDE RULES

- Partners can only manage their OWN services
- A partner must have `verify_status = 'approved'` before creating any service
- Services start as `draft` or go straight to `pending` (partner's choice)
- Manager approves/rejects services before they appear in public catalog
- Combos can only bundle services from the SAME partner, all must be `approved`
- Drivers and guides are NOT app users — they are partner-managed contacts only
- Firebase Storage is replaced by Cloudinary — frontend uploads directly, backend stores URL only

---

## PART 1 — HOMESTAY

### 1.1 Data Structure

A homestay has two levels: **Property** and **Rooms**.

```
homestay (property level — created once)
  └── rooms (room type level — one record per room TYPE)
        └── room_availability (one row per room type per date)
```

**Property fields (homestays table):**

```
service_id          → FK to services table
check_in_time       → e.g. "14:00"
check_out_time      → e.g. "12:00"
cancellation_policy → text: "Full refund 3 days before, 50% within 3 days, none within 24h"
house_rules         → text: "No smoking, no pets, quiet after 10pm"
amenities           → text or array: "WiFi, AC, Kitchen, Parking, Pool"
host_approval_required → boolean, default false
```

**Room fields (rooms table):**

```
homestay_id         → FK to homestays
room_name           → "Garden View Double Room"
room_type           → enum: single/double/twin/suite/dormitory
max_occupancy       → integer: max guests per unit
size_sqm            → float, optional
bed_type            → enum: King/Queen/Twin/Single/Bunk/Sofa  ← DROPDOWN not freetext
bed_count           → integer
private_bathroom    → boolean
base_price          → weekday price per night
weekend_price       → Fri-Sun price per night (optional, falls back to base_price)
holiday_price       → peak season price (optional, falls back to base_price)
total_units         → HOW MANY IDENTICAL ROOMS OF THIS TYPE EXIST (critical field)
cleaning_fee        → one-time fee per booking, stored on ROOM not on booking
service_fee         → platform service fee per booking, stored on ROOM not on booking
min_nights          → minimum stay, default 1, changeable per availability row
```

**Availability fields (room_availability table):**

```
room_id             → FK to rooms
date                → one row per calendar date
available_units     → how many units are free on this date (starts at total_units)
price_override      → if set, overrides base/weekend/holiday price for this specific date
min_nights          → override min stay for this date range
is_blocked          → manually blocked by partner (maintenance, personal use)
UNIQUE(room_id, date)
```

### 1.2 The Units Concept — Critical

`total_units` means how many physically identical rooms of this type the partner owns.

**Live example:**

```
Lan's Ancient Town House has:
- Garden View Room: total_units = 3, base_price = 850,000₫
- Pool View Suite:  total_units = 1, base_price = 1,500,000₫
- Dormitory Bed:    total_units = 6, base_price = 200,000₫
```

Room availability table for Garden View Room on a given week:

```
date        available_units   note
2026-07-01  3                 all free
2026-07-02  3                 all free
2026-07-03  2                 Customer A booked 1 unit
2026-07-04  2                 Customer A still checked in
2026-07-05  3                 Customer A checked out
2026-07-06  0                 all 3 units booked by 3 different customers
2026-07-07  1                 partner blocked 2 units for maintenance
```

**Booking logic:**

- User books 1 unit for July 3–4 → check `available_units >= 1` for each date → decrement by 1
- User tries to book 3 units July 6 → `available_units = 0` → rejected
- Pool View Suite on July 6 → completely separate rows → unaffected by Garden View bookings

**Key rule:** When `available_units = 0` on any date in the requested range, the booking fails.
When `available_units > 0`, booking proceeds and decrements each date in the range.

### 1.3 Pricing Logic

Price for a booking is calculated as:

```
total = sum of price_per_night for each date + cleaning_fee + service_fee

price_per_night per date =
  IF room_availability.price_override IS NOT NULL → use price_override
  ELSE IF date is Friday/Saturday/Sunday AND room.weekend_price IS NOT NULL → use weekend_price
  ELSE IF date is public holiday AND room.holiday_price IS NOT NULL → use holiday_price
  ELSE → use room.base_price

cleaning_fee and service_fee come from the ROOM record
NEVER accept cleaning_fee or service_fee from user/frontend input
```

**Frontend display example for a booking July 1–3 (2 nights):**

```
July 1 (weekday):   850,000₫
July 2 (weekend):  1,050,000₫
Cleaning fee:        100,000₫
Service fee:          50,000₫
─────────────────────────────
Total:             2,050,000₫
```

### 1.4 Minimum Nights

`min_nights` is stored per availability row and can be overridden per date range.

```
July 1–5 (weekdays):  min_nights = 1
July 6–7 (weekend):   min_nights = 2
Jan 28–Feb 2 (Tết):   min_nights = 3
```

At booking time: validate that `(checkOutDate - checkInDate) >= max(min_nights across all dates in range)`.
If validation fails → return error: "Minimum stay for selected dates is X nights."

### 1.5 Service Creation Form (Frontend)

**Step 1 — Create base service** (shared with all service types):

```
title           text input, required
description     textarea, required
city            text input, required
address         text input + map pin picker
latitude        auto-filled from map picker
longitude       auto-filled from map picker
serviceType     = "homestay" (pre-selected, not editable)
images          multi-image upload via Cloudinary (min 3 photos recommended)
asDraft         toggle: "Save as draft" vs "Submit for review"
```

**Step 2 — Homestay property details:**

```
checkInTime         time picker, required
checkOutTime        time picker, required
cancellationPolicy  textarea
houseRules          textarea
amenities           checkbox group: WiFi/AC/Kitchen/Washing machine/Parking/Pool/...
hostApprovalRequired toggle, default off
```

**Step 3 — Add rooms (repeatable):**

```
roomName        text input
roomType        dropdown: Single/Double/Twin/Suite/Dormitory
maxOccupancy    number input
sizeSqm         number input, optional
bedType         dropdown: King/Queen/Twin/Single/Bunk/Sofa  ← NOT freetext
bedCount        number input
privateBathroom toggle
basePrice       number input, required
weekendPrice    number input, optional
holidayPrice    number input, optional
totalUnits      number input (how many identical rooms), required, min 1
cleaningFee     number input, default 0
serviceFee      number input, default 0
roomImages      multi-image upload
```

Partner adds as many room types as needed. At least 1 room required before submission.

### 1.6 Availability Management (AFTER service is approved — separate screen)

NOT part of the creation form. Partner accesses via "Manage Availability" after approval.

```
Select room type → view calendar →
  Open date range: set available_units, price_override (optional), min_nights
  Block dates: is_blocked = true (maintenance, personal use)
  Bulk operations: "Open all of July", "Block every Sunday"
```

**Important:** Availability management is ongoing. Partner does this weekly/monthly.
It is never part of the initial service creation wizard.

### 1.7 host_approval_required Flow

If `host_approval_required = false` (default):

```
User pays → payment success → booking auto-confirmed → partner notified
```

If `host_approval_required = true`:

```
User pays (pre-authorization, not capture) →
Partner has 24h to approve or deny →
  APPROVE: capture payment → booking confirmed → user notified
  DENY: void authorization → booking cancelled → user notified with reason
  NO RESPONSE in 24h: auto-deny → void authorization → booking cancelled
```

### 1.8 Auto Status Transitions (Cron Jobs)

```
checkInDate  = today  → Confirmed → InProgress   (daily midnight job)
checkOutDate = yesterday → InProgress → Completed (daily 00:05 job)
Completed → review unlocked for this user+booking
```

### 1.9 Edge Cases

- Partner tries to block dates that already have confirmed bookings → show warning, only block future unbooked dates
- Partner changes base_price → only affects future availability rows, not existing bookings
- Guest requests early check-in → handled via special_requests text field, not a system feature
- Partner reduces total_units (e.g. from 3 to 2) → only applies to new availability rows, existing bookings unaffected
- If all room types have available_units = 0 for requested dates → service shows as "unavailable" for those dates in catalog

---

## PART 2 — CAR RENTAL

### 2.1 Data Structure

```
vehicle (one record per physical vehicle)
  └── vehicle_availability (one row per date)
  └── booking_transport_detail (one per booking)

drivers (partner's driver contacts — NOT app users)
  └── linked to partner_profiles
```

**Vehicle fields:**

```
service_id        → FK to services (each vehicle IS a separate service listing)
make              → "Toyota"
model             → "Fortuner"
year              → 2022
vehicle_type      → enum: sedan/suv/van/limousine/motorbike
capacity          → 7 (seats)
fuel_type         → enum: petrol/diesel/electric
transmission      → enum: automatic/manual
license_plate     → for identification at pickup
pricing_model     → enum: daily/hourly  ← MUST be explicit, never inferred
daily_rate        → required if pricing_model = 'daily'
hourly_rate       → required if pricing_model = 'hourly'
driver_included   → boolean
deposit_amount    → security deposit held at booking, default 0
included_features → array: ["driver", "fuel", "insurance", "child_seat_available"]
default_pickup    → text address
custom_pickup_allowed → boolean
custom_pickup_surcharge → amount added if customer specifies custom address
```

**Drivers table (partner-managed contacts):**

```
id
partner_id        → FK to partner_profiles
name
phone
license_number    → partner verifies this, not the platform
license_expiry    → date
photo_url         → optional, Cloudinary URL
is_active         → boolean
```

**Vehicle availability:**

```
vehicle_id
date
available_from    → TIME e.g. "08:00"
available_to      → TIME e.g. "20:00"
is_blocked        → maintenance, personal use
UNIQUE(vehicle_id, date)
```

**Booking transport detail:**

```
booking_id
vehicle_id
rental_start      → TIMESTAMPTZ (exact datetime)
rental_end        → TIMESTAMPTZ (exact datetime)
pickup_location   → text (default or custom address)
return_location   → text
driver_id         → FK to drivers table (assigned by partner after booking)
driver_name       → snapshot at booking time
driver_phone      → snapshot at booking time
```

### 2.2 One Vehicle = One Service Listing

Unlike homestay (one service, multiple rooms), each physical vehicle is its own service.

```
Minh's Car Rental company has:
- Service listing 1: "Toyota Fortuner 2022 - 7 seat SUV" (vehicle_id: AAA)
- Service listing 2: "Toyota Fortuner 2022 - 7 seat SUV" (vehicle_id: BBB) ← identical but separate
- Service listing 3: "Mercedes C-Class - Luxury Sedan"   (vehicle_id: CCC)
- Service listing 4: "Ford Transit 16-seat Van"           (vehicle_id: DDD)
```

There is no "units" concept for vehicles. You cannot rent 2 seats of the same car
to different people. Each vehicle is an indivisible unit.

If Minh has 3 identical Fortuners, he creates 3 separate listings.
He can name them "Toyota Fortuner #1", "Toyota Fortuner #2", "Toyota Fortuner #3"
or simply list them all as "Toyota Fortuner 2022 - 7 seat SUV" — they appear as
3 separate results in the catalog with independent availability.

### 2.3 Pricing Model — Must Be Explicit

```
pricing_model = 'daily':
  cost = number_of_calendar_days × daily_rate
  e.g. pickup July 1 08:00, return July 3 18:00 = 3 days × 1,500,000₫ = 4,500,000₫

pricing_model = 'hourly':
  cost = total_hours × hourly_rate
  e.g. 6 hours × 200,000₫ = 1,200,000₫
```

Backend calculates this — frontend sends rental_start and rental_end,
backend computes cost based on the vehicle's pricing_model.
NEVER let frontend calculate and send the total.

### 2.4 Driver Handling

Drivers are employees/contractors of the partner. They do NOT have app accounts.
Manager verification does NOT extend to individual drivers — only the partner's
business license and transport operating permit are verified.

Partner workflow:

1. Register drivers in "Driver Management" screen (name, phone, license info)
2. After a booking is confirmed, partner assigns a driver from their list
3. System sends customer: driver name + phone 24h before rental

If `driver_included = false` (self-drive):

- User must provide driver's license at booking (upload via Cloudinary) or on arrival
- No driver assignment needed

### 2.5 Custom Pickup Location

Set at booking time, NOT at service creation time.

**Service creation form sets:**

```
default_pickup_location:    "Da Nang International Airport"
custom_pickup_allowed:      true
custom_pickup_surcharge:    50,000₫
```

**Booking form shows to user:**

```
Pickup location:
  ● Da Nang International Airport (default, no extra charge)
  ○ Custom address: [________] (+50,000₫)

Return location:
  ● Same as pickup
  ○ Different location: [________]
```

Custom address stored in `booking_transport_detail.pickup_location`.
Partner sees the full address in their booking details and briefs their driver.

### 2.6 Security Deposit Flow

Deposit is a SEPARATE payment row from the rental fee.

```
At booking:
  payments row 1: type='full', amount=rental_fee, status=paid
  payments row 2: type='security_deposit', amount=deposit_amount, status=held

Post-rental (within 72h):
  Partner action "Close Rental" with one of:
    a) No damage → payments row 2 status='refunded' → refund to customer
    b) Damage deduction → approved_amount = deposit - damage_cost → partial refund
    c) Dispute → platform mediates

If partner takes NO action within 72h:
  Cron job auto-refunds full deposit → payments row 2 status='refunded'
```

### 2.7 Service Creation Form (Frontend)

**Step 1 — Base service** (same as all types):

```
title           e.g. "Toyota Fortuner 2022 - 7 Seat SUV with Driver"
description     textarea
city            where vehicle operates
address         default pickup location + map pin
serviceType     = "car_rental"
images          vehicle photos: exterior, interior, dashboard (min 3)
asDraft         toggle
```

**Step 2 — Vehicle details:**

```
make            text input
model           text input
year            number input
vehicleType     dropdown: Sedan/SUV/Van/Limousine/Motorbike
capacity        number input (seats)
fuelType        dropdown: Petrol/Diesel/Electric
transmission    dropdown: Automatic/Manual
licensePlate    text input
pricingModel    radio: Daily / Hourly  ← required selection
dailyRate       number input (shown if pricingModel=daily)
hourlyRate      number input (shown if pricingModel=hourly)
driverIncluded  toggle
depositAmount   number input, default 0
includedFeatures checkboxes: Driver/Fuel/Insurance/Child seat/WiFi
customPickupAllowed toggle
customPickupSurcharge number input (shown if customPickupAllowed=true)
```

### 2.8 Availability Management (After approval — separate screen)

```
Calendar per vehicle:
  Set working hours per day: available_from, available_to
  Block dates: maintenance, holidays, already booked elsewhere
```

When a booking is confirmed, the system auto-blocks those dates.
If booking is cancelled, system auto-unblocks.

### 2.9 Edge Cases

- User tries to book vehicle for dates partially blocked → reject entire booking, show which dates are unavailable
- Partner assigns a driver who is already assigned to another booking same date → show warning (system cannot auto-prevent without driver availability tracking — partner manages manually)
- Rental crosses midnight (e.g. 18:00 to 02:00) → counts as 2 calendar days for daily pricing
- Deposit amount = 0 → no security deposit row created, no post-rental action needed
- Self-drive vehicle: if user hasn't uploaded license → flag at booking, partner can require it on arrival

---

## PART 3 — TOUR

### 3.1 Data Structure

```
tour (product level — the tour concept)
  └── tour_itinerary (ordered steps — what happens during the tour)
  └── tour_schedules (individual departure instances — when it runs)

guides (partner's guide contacts — NOT app users)
  └── linked to partner_profiles
```

**Tour fields:**

```
service_id          → FK to services
tour_type           → dropdown (see options below) ← NOT freetext
duration_hours      → integer
min_participants    → minimum to run the departure, default 1
max_capacity        → maximum per departure
meeting_point       → text address + coordinates
cancellation_policy → text
highlights          → text or array (bullet points for listing display)
includes            → array: ["guide", "breakfast", "entrance fees", "transport"]
excludes            → array: ["personal expenses", "tips", "travel insurance"]
what_to_bring       → array: ["comfortable shoes", "raincoat", "cash"]
age_restriction     → text, optional: "suitable for all ages" / "18+" / "children welcome"
```

**Tour type options (dropdown, NOT freetext):**

```
Food & Culinary
Cultural & Historical
Adventure & Trekking
Water Sports
City Sightseeing
Countryside & Nature
Nightlife
Workshops & Classes
Photography Tours
```

Reason: consistent data enables "browse Food tours in Hanoi" filtering.

**Fields removed from original plan:**

- ~~difficulty_level~~ → removed, unnecessary for thesis scope
- ~~fitness_requirements~~ → removed, unnecessary for thesis scope

**Itinerary fields (tour_itineraries table):**

```
tour_id
step_order      → 1, 2, 3...
location        → "Hoan Kiem Lake"
activity        → "Meet guide and group briefing"
duration_minutes → 15
description     → optional detail
```

Itinerary is replaced entirely on each update (not appended).
Frontend shows itinerary as a visual timeline on the service detail page.

**Schedule fields (tour_schedules table):**

```
tour_id
tour_date       → DATE: "2026-07-01"
start_time      → TIME: "08:00"
end_time        → TIME: "12:00"
available_slots → starts at max_capacity, decremented per booking
booked_slots    → incremented per booking
price           → per person for THIS departure (can vary by date)
guide_id        → FK to guides table, nullable
is_active       → boolean, partner can toggle per departure
```

### 3.2 Tour Schedules — What "Repeated per Date" Means

A tour product is a template. Schedules are individual departure instances.

```
"Hanoi Street Food Walking Tour" (tour product)
├── Schedule: 2026-07-01, 08:00–12:00, 12 slots, 450,000₫, Guide: Nguyen Van A, active ✅
├── Schedule: 2026-07-03, 08:00–12:00, 12 slots, 450,000₫, Guide: Tran Thi B,   active ✅
├── Schedule: 2026-07-05, 08:00–12:00, 12 slots, 550,000₫, Guide: Nguyen Van A, active ✅ ← weekend price
└── Schedule: 2026-07-06, 08:00–12:00, 12 slots, 550,000₫, Guide: [unassigned], inactive ❌ ← guide sick
```

`is_active = false` hides that departure from the booking calendar.
The tour product itself and all other departures remain live.

### 3.3 Price Per Departure

Each schedule has its own price. The same tour costs different amounts on different dates:

```
Weekday departure:      450,000₫/person
Weekend departure:      550,000₫/person  (+22%)
Tết departure:          750,000₫/person  (+67%)
Special event date:     900,000₫/person
```

Backend calculates: `total = schedule.price × participants`
Frontend sends `originalAmount = 0`, backend fills in the actual amount from the schedule record.
NEVER trust frontend-supplied price for tour bookings.

### 3.4 Available Slots Display

Show users `available_slots` (remaining), NOT `max_capacity` (total).

```
CORRECT: "3 spots left"      ← creates urgency, accurate
WRONG:   "12 person capacity" ← irrelevant to the user
```

When `available_slots = 0`:

- Departure shows as "Full" or "Sold out"
- Do not accept new bookings for this departure
- Optionally show a waitlist button (out of scope for thesis)

### 3.5 Minimum Participants

`min_participants` is the minimum number of confirmed bookings needed to run a departure.

```
scenario: min_participants = 2, tour_date = tomorrow
current confirmed bookings for this departure = 1

System behavior:
  → Cron job 48h before: notify partner "Departure tomorrow has only 1 booking, minimum is 2"
  → Partner manually decides: proceed or toggle is_active = false
  → If partner cancels: all confirmed bookings for this departure → cancelled + refunded
  → If partner proceeds: run the tour for 1 person (their business decision)
```

There is no automatic cancellation. The partner makes the final call.
For thesis scope: just the partner notification + manual toggle is sufficient.

### 3.6 Guide Handling

Same as drivers — guides are NOT app users.

**Guides table:**

```
id
partner_id
name
phone
languages     → array: ["Vietnamese", "English"]
photo_url     → Cloudinary URL, optional
bio           → text, optional
is_active     → boolean
```

Partner registers guides once in "Guide Management."
When creating a departure schedule, partner selects guide from dropdown.
Guide can be left unassigned — partner gets a reminder to assign before tour date.

**24h before tour date (automated):**

```
IF guide_id IS NOT NULL:
  Send customer: "Your guide is {name}, contact: {phone}, meet at {meeting_point} at {start_time}"
ELSE:
  Send partner: "⚠️ No guide assigned for tomorrow's {tour_name} departure"
```

### 3.7 Service Creation Form (Frontend)

**Step 1 — Base service:**

```
title           text
description     textarea
city            text + map pin (for meeting point location)
address         meeting point address
serviceType     = "tour"
images          tour photos via Cloudinary
asDraft         toggle
```

**Step 2 — Tour details:**

```
tourType        dropdown (see options in 3.1)
durationHours   number input
minParticipants number input, default 1
maxCapacity     number input, required
meetingPoint    text (detailed address)
cancellationPolicy textarea
highlights      tag-style input (add bullet points)
includes        tag-style input
excludes        tag-style input
whatToBring     tag-style input
ageRestriction  text input, optional
```

**Step 3 — Itinerary (ordered steps):**

```
[+ Add Step] button
Each step:
  stepOrder   auto-numbered
  location    text input
  activity    text input
  duration    number input (minutes)
  description textarea, optional
[drag to reorder]
```

**Step 4 — Departure schedules (repeatable rows):**

```
[+ Add Departure] button
Each departure row:
  tourDate        date picker (must be future date)
  startTime       time picker
  endTime         time picker
  availableSlots  number input (pre-fills with maxCapacity)
  price           number input per person ← REQUIRED per row, varies by date
  guideId         dropdown from partner's guides list (optional)
  isActive        toggle, default true
```

### 3.8 Edge Cases

- Partner adds past date as schedule → validate: tourDate must be > today, reject with error
- Partner sets price = 0 on a departure → validate: price must be > 0
- All slots filled → available_slots = 0 → departure shows as "Full", booking blocked
- Departure deactivated after some bookings exist → existing confirmed bookings are NOT cancelled, only new ones blocked
- Partner edits meeting point AFTER bookings exist → send notification to all confirmed bookings for future departures with updated location
- Tour itinerary updated → does not affect existing bookings, only future display
- Guide assigned to departure is deactivated → departure's guide_id becomes orphaned, show warning in partner dashboard

---

## PART 4 — COMBOS

### 4.1 Rules

```
1. All services in a combo must belong to the SAME partner
2. All services must have status = 'approved'
3. discountedPrice must be strictly < originalPrice
4. validTo must be in the future at creation time
5. maxBookings must be > 0
6. Combos cannot contain other combos (no nesting)
7. Manager must approve combos before they go live
8. Auto-deactivate when currentBookings >= maxBookings
```

### 4.2 All Valid Combinations

**✅ Tour + Homestay (most common)**

```
"Hội An 2D1N Experience" — Partner: Lan's Travel Co
  Component 1: "Old Town Walking Tour" (tour) — July 2 morning departure
  Component 2: "Lan's Townhouse - Garden View Room" (homestay) — July 1–2 (1 night)

Timeline: guest checks in July 1 → does tour July 2 morning → checks out July 2 noon
Booking form collects: check-in date for homestay + which departure for tour
```

**✅ Homestay + Car Rental**

```
"Da Nang Beach Package" — Partner: Minh's Resort & Transfers
  Component 1: "Beachfront Suite" (homestay) — 3 nights
  Component 2: "Toyota Fortuner with Driver" (car rental) — airport pickup day 1

Timeline: car picks up on arrival day → stays 3 nights → car available for day trips
```

**✅ Tour + Tour**

```
"Hanoi 2-Day Discovery" — Partner: Hanoi Explore Tours
  Component 1: "Street Food Walking Tour" — Day 1 morning
  Component 2: "Old Quarter History Bike Tour" — Day 2 morning

Condition: partner must own both tour products ✅
```

**✅ Car + Car**

```
"Full Trip Transfer Package" — Partner: Minh's Car Rental
  Component 1: "Airport Pickup - Sedan" — arrival day
  Component 2: "Airport Dropoff - Van" — departure day (larger vehicle for group)

Makes sense when different vehicle types serve different legs of a trip ✅
```

**✅ Homestay + Homestay (rare but valid)**

```
"Multi-City Vietnam Trip" — Partner: VN Boutique Hotels Group
  Component 1: "Hanoi Boutique Room" — nights 1–2
  Component 2: "Hoi An Heritage Room" — nights 4–5

Valid ONLY if same partner owns properties in both cities.
Rare in practice. System allows it if the rule (same partner, both approved) is met.
```

**✅ Tour + Homestay + Car (3-way)**

```
"Complete Sapa Experience" — Partner: Sapa Adventure Co
  Component 1: "Minivan Transfer Hanoi→Sapa" (car) — Day 1
  Component 2: "Fansipan Trek" (tour) — Day 2
  Component 3: "Mountain Homestay" (homestay) — Night 2–3

All 3 owned by same partner ✅
```

### 4.3 All Invalid Combinations

**❌ Different partners**

```
Lan's Homestay (Partner A) + Minh's Car Rental (Partner B)
→ BLOCKED: "You can only bundle your own approved services"
This is the most common mistake — UI must explain this clearly
```

**❌ Unapproved service**

```
Lan tries to bundle:
  - Garden View Room (approved ✅)
  - New Beachfront Room (status: pending ❌)
→ BLOCKED: "All services in a combo must be approved"
```

**❌ Combo within a combo**

```
Partner tries to add an existing combo as a component
→ BLOCKED: combos can only contain individual services
```

**❌ Expired or suspended service**

```
Service with status = 'suspended' or 'rejected' cannot be bundled
→ BLOCKED at combo creation
```

**❌ discountedPrice >= originalPrice**

```
originalPrice: 3,000,000₫
discountedPrice: 3,500,000₫
→ BLOCKED: "Discounted price must be less than original price"
```

### 4.4 Combo Booking — Date Collection (Critical)

A combo has NO single date. Each component needs its own dates.
This is the most complex UX in the system.

**Booking form for "Hội An 2D1N Experience":**

```
Homestay component:
  Check-in date:  [date picker]
  Check-out date: [date picker]
  Room type:      Garden View Room (pre-selected from combo definition)

Tour component:
  Select departure: [dropdown showing available schedules]
    e.g. "July 2 — 08:00–12:00 — 5 spots left — 450,000₫/person"
  Participants: [number input]
  Pickup location: [text input]
```

Backend combo booking validation (ALL must pass before any lock is acquired):

```
1. Validate homestay dates: room available for those dates?
2. Validate tour departure: enough slots for requested participants?
3. Validate combo is still active: currentBookings < maxBookings?
4. Validate combo not expired: today < validTo?
```

If ANY validation fails → entire combo booking fails with specific error message.
NEVER partially book a combo.

If all pass:

```
Acquire Redis locks for ALL components simultaneously:
  lock:room:{roomId}:{date} for each date
  lock:tour_schedule:{scheduleId}

Single PostgreSQL transaction:
  INSERT bookings (type='combo', comboId=...)
  INSERT booking_homestay_detail
  INSERT booking_tour_detail
  DECREMENT room_availability.available_units for each date
  DECREMENT tour_schedules.available_slots
  INSERT payments (single payment for full combo discountedPrice)
  Mark voucher used if applied

Release all locks
```

On payment success:

```
Both component bookings confirmed in one status update
Partner notified for each component service
```

On payment failure:

```
ALL inventory decrements reversed
All locks released
Booking cancelled
```

### 4.5 Combo Management

```
Partner can:
  - Deactivate combo (isActive = false) without affecting existing bookings
  - Extend validTo date
  - Cannot change the component services after manager approval
  - Cannot increase discountedPrice (defeats the purpose)

System auto-deactivates when:
  currentBookings >= maxBookings

Manager can:
  - Approve: isActive → true, status → approved
  - Reject: status → rejected, notify partner with reason
  - Combos with rejected status cannot receive bookings
```

---

## PART 5 — SHARED BACKEND RULES

### 5.1 Inventory Protection

```
ALWAYS:
  Acquire Redis lock BEFORE checking availability
  Check availability INSIDE the lock
  Modify inventory INSIDE a PostgreSQL transaction
  Release lock AFTER transaction commits

NEVER:
  Decrement inventory outside a transaction
  Trust frontend-supplied prices or fees
  Allow status transitions that violate the state machine
```

### 5.2 Booking State Machine

```
Pending(1) → Confirmed(2): on payment success callback
Pending(1) → Cancelled(5): on payment failure OR timeout (15 min unpaid)
Confirmed(2) → InProgress(3): cron job on service start date
Confirmed(2) → Cancelled(5): user cancels (refund rules apply)
Confirmed(2) → Refunded(6): partner or manager processes refund
InProgress(3) → Completed(4): cron job on service end date
Completed(4) → [terminal]: no further transitions
Cancelled(5) → [terminal]: no further transitions
Refunded(6) → [terminal]: no further transitions
```

### 5.3 Fee Ownership

```
cleaning_fee    → stored on rooms table, read at booking time
service_fee     → stored on rooms table, read at booking time
deposit_amount  → stored on vehicles table, read at booking time
platform_fee %  → stored on services table, applied to every payment
```

NEVER accept fee values from frontend input.
Always read from the database record.

### 5.4 Notifications Required

```
Event                           → Notify
────────────────────────────────────────────
Booking created (Pending)       → User
Payment confirmed (Confirmed)   → User + Partner
Booking cancelled               → User + Partner
Refund approved                 → User
Refund rejected                 → User
Service approved by manager     → Partner
Service rejected by manager     → Partner
Combo approved by manager       → Partner
Guide not assigned (24h before) → Partner (warning)
Guide/driver contact (24h before)→ User
No-show minimum participants    → Partner (48h before tour)
Deposit auto-refunded           → User (72h post car rental)
```

### 5.5 Revenue Split (Every Payment)

```
grossAmount         = what user paid (finalAmount after voucher)
platformFeeAmount   = grossAmount × (service.platformFeePercent / 100)
partnerPayoutAmount = grossAmount - platformFeeAmount

Store all three on every payment row.
```

---

## PART 6 — FRONTEND DISPLAY REQUIREMENTS

### Service Detail Page

**All service types must show:**

- Service images (gallery)
- Title, description, location with map
- Partner name and rating
- Average rating + review count
- Cancellation policy (plain language)
- Price clearly with breakdown before booking

**Homestay detail page additionally:**

- Room types list with photos, capacity, bed type, amenities
- Price per night for each room type
- Availability calendar (greyed out = unavailable)
- Price breakdown preview when dates are selected (before booking)

**Car rental detail page additionally:**

- Vehicle photos (exterior + interior)
- Specs: make, model, year, type, capacity, transmission, fuel
- What's included list
- Pricing model clearly stated (per day or per hour)
- Deposit amount disclosed before booking
- Pickup location with map
- Driver availability status

**Tour detail page additionally:**

- Visual itinerary timeline (step by step with durations)
- What's included / excluded / what to bring
- Departure calendar showing available dates + remaining slots per date
- Price per person (varies by departure — show when user selects a date)
- Meeting point with map
- Min/max participants

### Catalog / Browse Page

- Filter by: city, service type, price range, rating
- For tours: filter by tour type
- Sort by: price, rating, newest, most booked
- Show remaining slots for tours (urgency)
- Show "unavailable for your dates" state when user has filtered by date
- Approved services only — never show draft/pending/rejected

### Partner Dashboard

- Upcoming bookings (next 7 days) across all services
- Revenue this month vs last month
- Occupancy rate per room (homestay)
- Fleet utilization per vehicle (car rental)
- Departure fill rate per schedule (tour)
- Pending refund requests count (action required badge)
- Unread messages count
