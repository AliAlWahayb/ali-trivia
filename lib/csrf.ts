import { randomBytes } from "crypto";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CSRF_COOKIE = "csrfToken";

// Universal CSRF token generator (can be used on client or server)
export function generateCsrfToken() {
    return randomBytes(32).toString("hex");
}

// Server-only helpers (use in API routes or middleware, not in client code)
// import { cookies } from "next/headers";
// export async function setCsrfCookie(token: string) { ... }
// export async function getCsrfCookie() { ... }
// export async function validateCsrfToken(request: Request) { ... }

// For client-side, use document.cookie to set/get the CSRF token.
