# /add-cron

Add a scheduled background job to src/server/jobs/.

Each job: exports one async function + a schedule string. Register in src/server/jobs/index.js.

Reference @docs/booking-flows.md → "Required Cron Jobs" table for the full list.

Every job must:
- Log start and completion with job name + timestamp
- Catch and log errors without crashing the process
- Be idempotent (safe to run multiple times)
- Process in batches of max 100 rows

Job to add: $ARGUMENTS
