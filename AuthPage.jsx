import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #060608;
    --surface: #0e0e14;
    --surface2: #15151f;
    --border: rgba(255,255,255,0.06);
    --border-active: rgba(108,99,255,0.5);
    --accent: #6c63ff;
    --accent2: #ff6584;
    --text: #e8e8f0;
    --muted: #5a5a78;
    --success: #00e5a0;
  }

  .auth-root {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 24px;
  }

  /* Animated mesh background */
  .mesh {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .mesh-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.12;
    animation: drift 12s ease-in-out infinite alternate;
  }

  .mesh-orb:nth-child(1) {
    width: 500px; height: 500px;
    background: var(--accent);
    top: -150px; left: -100px;
    animation-delay: 0s;
  }

  .mesh-orb:nth-child(2) {
    width: 400px; height: 400px;
    background: var(--accent2);
    bottom: -100px; right: -80px;
    animation-delay: -4s;
    opacity: 0.08;
  }

  .mesh-orb:nth-child(3) {
    width: 300px; height: 300px;
    background: #00e5a0;
    top: 50%; left: 60%;
    animation-delay: -8s;
    opacity: 0.06;
  }

  @keyframes drift {
    from { transform: translate(0, 0) scale(1); }
    to { transform: translate(30px, 20px) scale(1.05); }
  }

  /* Grid texture */
  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  /* Card */
  .card {
    position: relative;
    width: 100%;
    max-width: 420px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 28px;
    padding: 40px;
    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    backdrop-filter: blur(20px);
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 28px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(108,99,255,0.3), transparent 50%, rgba(255,101,132,0.15));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Logo */
  .logo-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  .logo-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 30px rgba(108,99,255,0.35);
  }

  .logo-text {
    font-size: 22px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.5px;
  }

  .logo-text span {
    color: var(--accent);
  }

  /* Heading */
  .heading {
    font-size: 28px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
    margin-bottom: 6px;
    letter-spacing: -0.5px;
  }

  .subtext {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 32px;
    font-family: 'DM Mono', monospace;
    font-weight: 300;
  }

  /* Tab switcher */
  .tabs {
    display: flex;
    background: var(--surface2);
    border-radius: 14px;
    padding: 4px;
    margin-bottom: 28px;
    border: 1px solid var(--border);
  }

  .tab {
    flex: 1;
    padding: 10px;
    border: none;
    background: transparent;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    color: var(--muted);
  }

  .tab.active {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 4px 20px rgba(108,99,255,0.4);
  }

  /* Form */
  .field {
    margin-bottom: 16px;
    animation: fieldIn 0.4s ease both;
  }

  @keyframes fieldIn {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    margin-bottom: 8px;
    font-family: 'DM Mono', monospace;
  }

  .input-wrap {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
  }

  .input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 13px 14px 13px 42px;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: all 0.2s ease;
  }

  .input::placeholder { color: var(--muted); }

  .input:focus {
    border-color: var(--border-active);
    background: rgba(108,99,255,0.05);
    box-shadow: 0 0 0 3px rgba(108,99,255,0.1);
  }

  /* Error */
  .error {
    background: rgba(255,101,132,0.08);
    border: 1px solid rgba(255,101,132,0.25);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    color: #ff6584;
    margin-bottom: 16px;
    font-family: 'DM Mono', monospace;
    animation: shake 0.3s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  /* Submit button */
  .btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--accent), #8b5cf6);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(108,99,255,0.35);
    letter-spacing: 0.3px;
  }

  .btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .btn:hover::after { opacity: 1; }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(108,99,255,0.45); }
  .btn:active { transform: translateY(0) scale(0.98); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Spinner */
  .spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .divider-text {
    font-size: 12px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
  }

  /* Social */
  .social-btn {
    width: 100%;
    padding: 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s;
  }

  .social-btn:hover {
    border-color: var(--border-active);
    background: rgba(108,99,255,0.05);
  }

  /* Footer */
  .footer-text {
    text-align: center;
    font-size: 12px;
    color: var(--muted);
    margin-top: 20px;
    font-family: 'DM Mono', monospace;
  }

  /* Success state */
  .success-icon {
    width: 60px; height: 60px;
    background: rgba(0,229,160,0.1);
    border: 2px solid var(--success);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    animation: popIn 0.4s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes popIn {
    from { transform: scale(0.5); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .strength-bar {
    height: 3px;
    border-radius: 2px;
    margin-top: 6px;
    background: var(--surface2);
    overflow: hidden;
  }

  .strength-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease, background 0.3s ease;
  }
`;

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function getPasswordStrength(p) {
  if (!p) return { score: 0, label: "", color: "" };
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  const map = [
    { label: "Too short", color: "#ff6584" },
    { label: "Weak", color: "#ff6584" },
    { label: "Fair", color: "#ffb347" },
    { label: "Good", color: "#6c63ff" },
    { label: "Strong", color: "#00e5a0" },
    { label: "Very strong", color: "#00e5a0" },
  ];
  return { score: s, ...map[s] };
}

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const strength = getPasswordStrength(form.password);

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setForm({ username: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "register" && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    // Simulate API call — replace with your real axios call
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    // Uncomment below and replace with real logic:
    // try {
    //   if (mode === "login") await login(form.email, form.password);
    //   else await register(form.username, form.email, form.password);
    //   navigate("/chat");
    // } catch (err) {
    //   setError(err.response?.data?.message || "Something went wrong");
    // }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="mesh">
          <div className="mesh-orb" />
          <div className="mesh-orb" />
          <div className="mesh-orb" />
        </div>
        <div className="grid-overlay" />

        <div className="card" style={{ opacity: mounted ? 1 : 0 }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div className="success-icon">
                <svg width="28" height="28" fill="none" stroke="#00e5a0" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{ color: "#00e5a0", fontWeight: 700, fontSize: 20 }}>
                {mode === "login" ? "Welcome back!" : "Account created!"}
              </p>
              <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
                Redirecting you now...
              </p>
            </div>
          ) : (
            <>
              {/* Logo */}
              <div className="logo-wrap">
                <div className="logo-icon">
                  <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <span className="logo-text">Night<span>Chat</span></span>
              </div>

              <h1 className="heading">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h1>
              <p className="subtext">
                {mode === "login"
                  ? "// sign in to continue"
                  : "// join the conversation"}
              </p>

              {/* Tabs */}
              <div className="tabs">
                <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => switchMode("login")}>Sign In</button>
                <button className={`tab ${mode === "register" ? "active" : ""}`} onClick={() => switchMode("register")}>Register</button>
              </div>

              <form onSubmit={handleSubmit}>
                {mode === "register" && (
                  <div className="field" key="username">
                    <label className="label">Username</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </span>
                      <input
                        className="input"
                        type="text"
                        placeholder="your_username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        required
                        autoComplete="username"
                      />
                    </div>
                  </div>
                )}

                <div className="field">
                  <label className="label">Email</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                    <input
                      className="input"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </span>
                    <input
                      className="input"
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      style={{ paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{
                        position: "absolute", right: 14, top: "50%",
                        transform: "translateY(-50%)", background: "none",
                        border: "none", cursor: "pointer", color: "var(--muted)",
                        display: "flex", alignItems: "center"
                      }}
                    >
                      <EyeIcon open={showPw} />
                    </button>
                  </div>

                  {mode === "register" && form.password && (
                    <div className="strength-bar">
                      <div
                        className="strength-fill"
                        style={{
                          width: `${(strength.score / 5) * 100}%`,
                          background: strength.color
                        }}
                      />
                    </div>
                  )}
                  {mode === "register" && form.password && (
                    <p style={{ fontSize: 11, color: strength.color, marginTop: 4, fontFamily: "'DM Mono', monospace" }}>
                      {strength.label}
                    </p>
                  )}
                </div>

                {mode === "login" && (
                  <div style={{ textAlign: "right", marginBottom: 16, marginTop: -8 }}>
                    <a href="#" style={{ fontSize: 12, color: "var(--accent)", fontFamily: "'DM Mono', monospace", textDecoration: "none" }}>
                      Forgot password?
                    </a>
                  </div>
                )}

                {error && <div className="error">⚠ {error}</div>}

                <button className="btn" type="submit" disabled={loading}>
                  {loading ? (
                    <><span className="spinner" />{mode === "login" ? "Signing in..." : "Creating..."}</>
                  ) : (
                    mode === "login" ? "Sign In →" : "Create Account →"
                  )}
                </button>
              </form>

              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">or</span>
                <div className="divider-line" />
              </div>

              <button className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
