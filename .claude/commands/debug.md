# /debug

Debug an issue in the VNS codebase.

Steps:

1. Identify the layer (route → controller → service → repository)
2. Check if it involves: Redis locking, DB transactions, state machine, or voucher validation
3. Propose fix with root cause explanation
4. Verify fix doesn't break adjacent flows in @docs/booking-flows.md

Issue: $ARGUMENTS
