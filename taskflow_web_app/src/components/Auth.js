import React, { useState } from "react";

// PUBLIC_INTERFACE
function Auth({ onLogin, onSignup }) {
  /** Handles authentication - minimal local simulated login/signup */
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Email and password required");
      return;
    }
    if (mode === "login") {
      const ok = onLogin(email, password);
      setMessage(ok ? "" : "Invalid login");
    } else {
      const ok = onSignup(email, password);
      setMessage(ok ? "Signup successful. You may log in." : "Signup failed.");
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
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="btn btn-large" type="submit">{mode === "login" ? "Log In" : "Sign Up"}</button>
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
