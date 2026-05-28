export const AUTH_STORAGE_KEY = "vollifx_auth";

export type MockUser = {
  name: string;
  email: string;
  role: "investor" | "admin";
};

export type StoredSession = {
  authenticated: true;
  user: MockUser;
  token?: string;
  createdAt: string;
};

export function createMockSession(user?: Partial<MockUser>, token?: string) {
  const session: StoredSession = {
    authenticated: true,
    user: {
      name: user?.name ?? "New Member",
      email: user?.email ?? "",
      role: user?.role ?? "investor"
    },
    token,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearMockSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getMockSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) as StoredSession : null;
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return getMockSession()?.token || "";
}

export function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
