import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AUTH_KEY = "taskflow-auth";

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides user authentication using localStorage (for demo only).
   * Users are an array of {email, password}.
   */
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate session: restore if present
    const entry = localStorage.getItem(AUTH_KEY);
    if (entry) {
      setUser(JSON.parse(entry));
    }
  }, []);

  function login(email, password) {
    // Get users from localStorage
    const raw = localStorage.getItem("users");
    const users = raw ? JSON.parse(raw) : [];
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser({ email });
      localStorage.setItem(AUTH_KEY, JSON.stringify({ email }));
      return true;
    }
    return false;
  }

  function signup(email, password) {
    const raw = localStorage.getItem("users");
    const users = raw ? JSON.parse(raw) : [];
    if (users.find((u) => u.email === email)) {
      return false;
    }
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }

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
