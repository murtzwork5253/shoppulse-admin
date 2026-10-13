import { api, ApiError, AUTH_EXPIRED_EVENT, TOKEN_KEY } from './client';

const respond = (status: number, body: unknown) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('returns the parsed JSON body', async () => {
    vi.stubGlobal('fetch', respond(200, { ok: true }));
    await expect(api('/anything')).resolves.toEqual({ ok: true });
  });

  it('sends the saved token as a Bearer header', async () => {
    localStorage.setItem(TOKEN_KEY, 'abc');
    const fetchMock = respond(200, {});
    vi.stubGlobal('fetch', fetchMock);
    await api('/auth/me');
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer abc');
  });

  it('throws an ApiError with the status and API message', async () => {
    vi.stubGlobal('fetch', respond(404, { message: "Cart with id '9' not found" }));
    await expect(api('/carts/9')).rejects.toMatchObject({
      status: 404,
      message: "Cart with id '9' not found",
    });
    await expect(api('/carts/9')).rejects.toBeInstanceOf(ApiError);
  });

  it('falls back to a generic message when the body is not JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('oops', { status: 500 })));
    await expect(api('/x')).rejects.toMatchObject({ message: 'Request failed (500)' });
  });

  it('clears the token and announces expiry on a 401', async () => {
    localStorage.setItem(TOKEN_KEY, 'expired');
    vi.stubGlobal('fetch', respond(401, { message: 'Token Expired!' }));
    const onExpired = vi.fn();
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    await expect(api('/auth/me')).rejects.toMatchObject({ status: 401 });
    window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it('does not treat a failed login as an expired session', async () => {
    localStorage.setItem(TOKEN_KEY, 'old');
    vi.stubGlobal('fetch', respond(401, { message: 'Invalid credentials' }));
    const onExpired = vi.fn();
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    await expect(api('/auth/login', { method: 'POST' })).rejects.toThrow('Invalid credentials');
    window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
    expect(onExpired).not.toHaveBeenCalled();
  });
});
