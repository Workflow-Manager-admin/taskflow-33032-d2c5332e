import React, { useState } from "react";

// PUBLIC_INTERFACE
function Auth({ onLogin, onSignup }) {
  /** Handles authentication using API (async) */
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Email and password required");
      return;
    }
    setLoading(true);
    if (mode === "login") {
      const ok = await onLogin(email, password);
      setMessage(ok ? "" : "Invalid login");
      if (!ok) setLoading(false);
    } else {
      const ok = await onSignup(email, password);
      setMessage(ok ? "Signup successful. You may log in." : "Signup failed.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submit}>
        <h2>{mode === "login" ? "Log In" : "Sign Up"}</h2>
        <input
          required
          type="email"
          autoFocus
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
        <button className="btn btn-large" type="submit" disabled={loading}>
          {loading
            ? (mode === "login" ? "Logging in..." : "Signing up...")
            : (mode === "login" ? "Log In" : "Sign Up")}
        </button>
        <div className="auth-switch">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span className="auth-link" onClick={() => setMode("signup")}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span className="auth-link" onClick={() => setMode("login")}>Log In</span>
            </>
          )}
        </div>
        <div className="auth-message">{message}</div>
      </form>
    </div>
  );
}

export default Auth;
