import { cookies } from "next/headers";

const CSRF_COOKIE = "csrfToken";

export async function setCsrfCookie(token: string) {
    const cookieStore = cookies();
    (await cookieStore).set(CSRF_COOKIE, token, { httpOnly: true, path: "/", sameSite: "lax", maxAge: 3600 });
}

export async function getCsrfCookie() {
    const cookieStore = cookies();
    return (await cookieStore).get(CSRF_COOKIE)?.value || null;
}

export async function validateCsrfToken(request: Request) {
    const cookieToken = await getCsrfCookie();
    const headerToken = request.headers.get('x-csrf-token');
    return cookieToken && headerToken && cookieToken === headerToken;
}
