import { createContext, useCallback, useMemo, useState } from 'react';
import { decodeToken, isTokenExpired } from '../utils/jwt.js';
import { getToken, setToken as persistToken, clearToken } from '../utils/tokenStorage.js';

export const AuthContext = createContext(null);

const resolveInitialToken = () => {
  const storedToken = getToken();
  if (!storedToken) return null;

  const decoded = decodeToken(storedToken);
  if (!decoded || isTokenExpired(decoded)) {
    // Stale/expired token left over from a previous session — clean it up
    // proactively instead of waiting for the API to reject it.
    clearToken();
    return null;
  }
  return storedToken;
};

/**
 * Provides app-wide authentication state derived from a single JWT.
 * `user` (id, role) is decoded from the token rather than stored separately,
 * so there is exactly one source of truth.
 */
export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(resolveInitialToken);

  const user = useMemo(() => {
    if (!token) return null;
    const decoded = decodeToken(token);
    return decoded ? { id: decoded.id, role: decoded.role } : null;
  }, [token]);

  const login = useCallback((newToken) => {
    persistToken(newToken);
    setTokenState(newToken);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(user), login, logout }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
