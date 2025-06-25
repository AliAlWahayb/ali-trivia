// Utility to get CSRF token from cookie (browser only)
export function getCsrfToken() {
    const match = document.cookie.match(/(?:^|; )csrfToken=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}
