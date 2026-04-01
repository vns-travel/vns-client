/**
 * apply-firebase-cors.mjs
 *
 * Applies cors.json to the Firebase Storage bucket using only Node.js built-ins.
 * No extra npm packages required.
 *
 * Usage:
 *   1. Download a service account key from Firebase Console:
 *      Firebase Console → Project Settings → Service Accounts → Generate new private key
 *      Save it as  scripts/service-account.json
 *   2. node scripts/apply-firebase-cors.mjs
 */

import { readFileSync } from "fs";
import { createSign } from "crypto";
import { request } from "https";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load config ────────────────────────────────────────────────────────────────
const saPath = join(__dirname, "service-account.json");
let sa;
try {
  sa = JSON.parse(readFileSync(saPath, "utf8"));
} catch {
  console.error("❌  service-account.json not found at:", saPath);
  console.error(
    "   Download it from Firebase Console → Project Settings → Service Accounts → Generate new private key"
  );
  process.exit(1);
}

const corsConfig = JSON.parse(
  readFileSync(join(__dirname, "..", "cors.json"), "utf8")
);

// Read bucket name from client/.env so it always matches the Firebase project config.
// Constructing it from project_id alone can be wrong when the bucket uses a non-default name.
const envFile = readFileSync(join(__dirname, "..", "client", ".env"), "utf8");
const bucketMatch = envFile.match(/^VITE_FIREBASE_STORAGE_BUCKET=(.+)$/m);
if (!bucketMatch) {
  console.error("❌  VITE_FIREBASE_STORAGE_BUCKET not found in client/.env");
  process.exit(1);
}
const BUCKET = bucketMatch[1].trim();

// ── Build a signed JWT for service account auth ────────────────────────────────
function buildJwt(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/devstorage.full_control",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const unsigned = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(unsigned);
  const signature = sign.sign(sa.private_key, "base64url");
  return `${unsigned}.${signature}`;
}

// ── Exchange JWT for an access token ──────────────────────────────────────────
function getAccessToken(jwt) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }).toString();

    const req = request(
      {
        hostname: "oauth2.googleapis.com",
        path: "/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          const json = JSON.parse(data);
          if (json.access_token) resolve(json.access_token);
          else reject(new Error("Token error: " + JSON.stringify(json)));
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── PATCH the bucket's CORS configuration ─────────────────────────────────────
function applyCors(token, bucket, cors) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ cors });
    const req = request(
      {
        hostname: "storage.googleapis.com",
        path: `/storage/v1/b/${encodeURIComponent(bucket)}?fields=cors`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          if (res.statusCode === 200) resolve(JSON.parse(data));
          else reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── Main ───────────────────────────────────────────────────────────────────────
const jwt = buildJwt(sa);
console.log("🔐  Obtaining access token...");
const token = await getAccessToken(jwt);

console.log(`🪣  Applying CORS to gs://${BUCKET}...`);
const result = await applyCors(token, BUCKET, corsConfig);

console.log("✅  CORS applied successfully:");
console.log(JSON.stringify(result.cors, null, 2));
