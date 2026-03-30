# /booking-flow

Implement or debug a booking flow for a VNS service type.

Read @docs/booking-flows.md first. Required sequence:
Redis lock → availability check → PostgreSQL transaction (booking + payment + inventory decrement) → release lock → payment gateway

Rules:
- Lock before any DB write
- Inventory changes inside transaction only
- Payment gateway after transaction commits
- Callback success: update status + notify both parties
- Callback failure: reverse inventory + cancel booking

Service type and operation: $ARGUMENTS
