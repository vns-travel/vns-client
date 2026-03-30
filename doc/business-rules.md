# VNS Business Rules — Validation & Edge Cases

---

## Booking State Machine Guard

```js
const ALLOWED_TRANSITIONS = {
  1: [2, 5],      // Pending → Confirmed, Cancelled
  2: [3, 5, 6],   // Confirmed → InProgress, Cancelled, Refunded
  3: [4, 5],      // InProgress → Completed, Cancelled (manager only)
  4: [],          // Completed — terminal
  5: [],          // Cancelled — terminal
  6: [],          // Refunded — terminal
};

function canTransitionTo(current, next) {
  return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
}
```

Run this before every booking status update. Return 400 if invalid.

---

## Voucher Rules
- Discount can never exceed order total (no negative final amount)
- isPublic=false: only the assigned userId can use it
- One voucher per booking maximum
- minimumAmount: voucher invalid if orderAmount < minimumAmount
- Errors: "Voucher expired" / "Usage limit reached" / "Not valid for this service type" / "Minimum order not met"

---

## Review Rules
- Only allowed when bookingStatus = Completed(4)
- One review per booking only
- User must own the booking
- Rating: integer 1–5 only
- Editable within 14 days of submission

---

## Combo Rules
- All services must belong to same partner and be approved
- discountedPrice must be strictly < originalPrice
- validTo must be in the future at creation
- Auto-deactivate when currentBookings >= maxBookings

---

## Partner Rules
- Can only read/modify bookings for their own services
- Refund approval: approvedAmount cannot exceed paidAmount
- Account must be manager-verified before any service goes live
- Cannot create vouchers (manager-only)

---

## Manager Rules
- Must provide rejection reason when declining a service (non-nullable)
- Can force-cancel any booking except Completed(4) and Refunded(6)
- Creates all vouchers; sets platformFeeAmount on services

---

## Inventory Protection
- NEVER decrement outside Redis lock + DB transaction pair
- NEVER restore inventory outside a transaction
- Idempotency: check current status before processing any payment callback

---

## Cancellation & Refund

Refund amount is determined by the service's cancellationPolicy:
- Full refund: cancelled N+ days before service date
- Partial refund: cancelled within N days but >24h before
- No refund: cancelled <24h before, or policy is non-refundable

Implement as a pure function:
```js
calculateRefundAmount(booking, cancellationPolicy, cancellationDate) → refundAmount
```

---

## Notification Triggers

| Event | Notify |
|-------|--------|
| Booking created (Pending) | User |
| Payment confirmed → Confirmed | User + Partner |
| Booking cancelled | User + Partner |
| Refund approved/rejected | User |
| Service approved/rejected by manager | Partner |
| New chat message | Recipient |
| Tour/rental tomorrow | User |
| Homestay check-in today | User |
