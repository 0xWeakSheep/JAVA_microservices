export type AuthUser = {
  userId: number;
  username: string;
  email: string;
  manager: boolean;
  permission: boolean;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

const TOKEN_STORAGE_KEY = "movies.auth.token";
const USER_STORAGE_KEY = "movies.auth.user";

export function loadAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  const user = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!token || !user) {
    return null;
  }

  try {
    return {
      token,
      user: JSON.parse(user) as AuthUser,
    };
  } catch {
    clearAuthSession();
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
}
