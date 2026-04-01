# VNS — VietNamSea Travel Platform

## Project Identity

Travel booking platform for domestic Vietnam tourism.
Three service types: **Tour**, **Homestay**, **Car Rental**.
Roles: Admin/Manager (web), Partner (web), User (Flutter mobile).

## Codebase Map

```
/client                     → Frontend (React + Vite + Tailwind)
  /src
    /components             → Reusable UI components
    /context                → React context providers (auth, global state)
    /pages
      /AdminPages           → Super Admin dashboard
      /ManagerPages         → Service approval, vouchers, partner verification
      /PartnerPages         → Listings, bookings, earnings, refunds
    /services               → API call wrappers (axios per domain, not backend services)
    App.jsx
    main.jsx

/server                     → Backend (Express.js, plain JavaScript — no TypeScript)
  index.js                  → Entry point: load env, connect DBs, start server
  /src
    /config
      env.js                → Zod-validated env vars (throws on missing)
      db.js                 → pg Pool + mongoose connect
      redis.js              → ioredis client
    /middleware
      auth.js               → JWT verification → req.user
      roles.js              → requireRoles(...roles) guard
      validate.js           → Zod body validation middleware
      errorHandler.js       → Centralised error handler (register last)
    /modules                → Feature modules (each has router/controller/service)
      /auth  /users  /partners  /services  /bookings
      /payments  /refunds  /vouchers  /reviews  /notifications  /chat
    app.js                  → Express app: cors, json, mount routers

/database
  /migrations               → SQL migration files (run in order)
```

## Code Generation Rules

### Before writing any code

- Read all affected existing files first
- Never overwrite a function that already works — extend it
- If a file has more than 50 lines, read it fully before editing

### After writing any code

- Run the server: `cd src/server && npm run dev` — must start without errors
- Run lint: `npm run lint` — must pass with 0 errors
- Test the affected endpoint manually before finishing

### Never do these

- Never delete existing working routes
- Never change response shapes that already work
- Never rename exported functions without finding all usages first
- Never add a new dependency without checking if one already exists

...

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Express.js (plain JS only — never suggest TypeScript)
- Validation: Zod (backend only)
- Databases: PostgreSQL (relational), MongoDB (flexible docs), Redis (locking + cache)
- Mobile: Flutter (separate repo, not in this workspace)
- Payments: ZaloPay, PayOS

## Commands

- Start frontend: `cd client && npm run dev`
- Start backend: `cd server && npm run dev`
- Run all with Docker: `docker compose up -d`

## Code Rules — Always Follow

- Plain JavaScript only. Never `.ts`, never TypeScript syntax.
- Zod validates all request bodies/queries in controllers.
- Repositories return plain objects. Never throw HTTP errors below the controller layer.
- All inventory writes (slots, availability, vehicle windows) MUST acquire Redis lock first.
- Multi-table writes MUST use a PostgreSQL transaction.
- Business logic lives in `/server/src/modules/<domain>/<domain>.service.js`. Controllers stay thin.
- Never hardcode UUIDs, fees, or status integers — use constants files.
- Error response format: `{ success: false, message: string, code?: string }`
- Success response format: `{ success: true, data: any, meta?: object }`
- Use context7

## Booking Status State Machine

```
Pending(1) → Confirmed(2) → InProgress(3) → Completed(4)
Pending(1) → Cancelled(5)
Confirmed(2) → Cancelled(5)
Confirmed(2) → Refunded(6)
Completed / Cancelled / Refunded → nothing (terminal states)
```

Always validate transitions before any status update.

## Enums

Service types: Homestay=0, Tour=1, Other(Car/Posts)=2
Booking status: Pending=1, Confirmed=2, InProgress=3, Completed=4, Cancelled=5, Refunded=6
Payment status: Pending=1, Completed=2, Failed=3, Refunded=4
Payment method: CreditCard=1, BankTransfer=2, Zalopay=3, Cash=4

## Thesis Note

Every non-obvious architectural decision must have a code comment explaining why.
Prefer well-known patterns over clever ones.

## Reference Docs (load on demand)

- @docs/booking-flows.md → Full booking logic for all 3 service types
- @docs/business-rules.md → Validation rules, guards, edge cases
