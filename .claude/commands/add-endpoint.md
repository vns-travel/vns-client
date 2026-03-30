# /add-endpoint

Add a new API endpoint to src/server following VNS conventions.

Order:
1. Zod schema → src/server/validations/
2. Repository function → src/server/repositories/ (query only, no logic)
3. Service function → src/server/services/ (logic, calls repository)
4. Controller → src/server/controllers/ (validate, call service, format response)
5. Route → src/server/routes/

Rules:
- No HTTP errors below controller layer
- Response format: { success: true/false, data/message }
- Check booking state machine if touching booking status (@docs/business-rules.md)

Endpoint: $ARGUMENTS
