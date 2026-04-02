# /wire-page

Wire a frontend page to the real backend API, replacing all hardcoded mock data with live API calls.

Read `CLAUDE.md` before starting.

Then read these files before writing anything:

- The page file specified in $ARGUMENTS
- `client/src/services/` — find the relevant API service file for this page's domain
- `server/src/modules/` — find the matching backend module to understand the real response shape

Follow these steps in order:

---

## Step 1 — Audit the page

Read the page file and identify:

- Every hardcoded array or object that should come from the API (look for `useState` with hardcoded data, `const mockData = [...]`, etc.)
- Every action (submit, delete, approve, etc.) that should call the backend
- What loading and error states are missing

List all findings before writing any code.

---

## Step 2 — Check the API service layer

Look in `client/src/services/` for the relevant service file.
If it doesn't exist or the function doesn't exist, create it following the existing pattern in that folder.

All API calls must:

- Use the existing axios instance or fetch wrapper already in the project
- Send the JWT token from localStorage/context in the Authorization header
- Return the data directly, throw on error

---

## Step 3 — Wire the page

Replace hardcoded data with real API calls:

```js
// Pattern to follow:
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      const result = await someService.getItems();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

Rules:

- Never remove existing UI components — only replace the data source
- Keep all existing styling and layout intact
- Add a loading spinner or skeleton where data is fetched
- Add an error message display if the API call fails
- For forms/actions: show a loading state on the button while submitting, show success/error feedback after

---

## Step 4 — Handle the response shape

Your backend always returns:

```json
{ "success": true, "data": { ... } }
```

or

```json
{ "success": false, "message": "..." }
```

Always extract `response.data.data` for the actual payload, not `response.data` directly.

---

## Step 5 — Test it

After wiring:

1. Open the browser and navigate to the page
2. Open Network tab — confirm the API call is being made
3. Confirm real data appears on screen
4. Test any actions (buttons, forms) and confirm they hit the backend
5. Report what works and what still has issues

Do not say done until you have confirmed the page loads real data from the API.

---

Page to wire: $ARGUMENTS
