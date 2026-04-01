# /check

Before considering any feature complete, do the following in order:

1. Run `cd src/server && npm run dev` — confirm server starts
2. Run `npm run lint` — fix all errors before continuing
3. Read back every file you modified and check for:
   - Missing exports
   - Functions called but not defined
   - Routes registered but controller method doesn't exist
   - Imports pointing to files that don't exist
4. List every file you changed in this session
5. Confirm the feature works by showing the test request and response

Do not say "done" until all 5 steps pass.
