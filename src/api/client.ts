const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://dummyjson.com';
export const TOKEN_KEY = 'shoppulse_token';
/** Fired when the API rejects the saved token, so the app can sign the user out. */
export const AUTH_EXPIRED_EVENT = 'shoppulse:auth-expired';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401 && token && path !== '/auth/login') {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}
