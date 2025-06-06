import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API } from "../api";

const AuthContext = createContext();

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides user authentication using API abstraction (mock for now).
   */
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate restoring session from API (could check cookies or local session)
    const session = API.getSession();
    setUser(session);
  }, []);

  const login = useCallback(async (email, password) => {
    const resp = await API.login(email, password);
    if (resp.ok) {
      setUser(resp.user);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (email, password) => {
    const resp = await API.signup(email, password);
    return resp.ok;
  }, []);

  const logout = useCallback(async () => {
    await API.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuthContext() {
  return useContext(AuthContext);
}
