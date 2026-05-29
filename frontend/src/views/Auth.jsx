import { useState } from "react";
import * as api from "../api.js";
import { ActaLogo } from "../shared.jsx";

export const AuthScreen = ({ onLogin }) => {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const u = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      if (tab === "signup") {
        if (!form.name) { setError("Name is required."); setLoading(false); return; }
        await api.register(form.name, form.email, form.password);
      }
      await api.login(form.email, form.password);
      const me = await api.getMe();
      onLogin(me);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <ActaLogo size={36}/>
        <div className="auth-subtitle">Records, deeds, things done.</div>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Log In</button>
          <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Sign Up</button>
        </div>
        {tab === "signup" && (
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" placeholder="Your name" value={form.name} onChange={e => u("name", e.target.value)}/>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => u("email", e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password}
                 onChange={e => u("password", e.target.value)}
                 onKeyDown={e => e.key === "Enter" && handleSubmit()}/>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="spinner"/> : tab === "login" ? "Log In" : "Create Account"}
        </button>
      </div>
    </div>
  );
};
