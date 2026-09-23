import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { register, loading } = useAuth();

  const nav = useNavigate();

  // =========================================
  // SUBMIT
  // =========================================

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await register(name, phone, email, password);

      nav("/language");
    } catch (error) {
      setError(error.message || "Registration failed");
    }
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Back */}

        <button type="button" className="back-button" onClick={() => nav(-1)}>
          <ArrowLeft size={21} />
        </button>

        {/* Brand */}

        <Link className="auth-brand" to="/">
          <span className="logo-mark"><img src="/assets/icon.jpg" alt="" /></span>
          <span className="app-name">Settle<span>G</span></span>
        </Link>

        {/* Heading */}

        <h1>Create your account</h1>

        <p>Start sharing expenses without the spreadsheet headache.</p>

        {/* Error */}

        {error && <div className="error-message">{error}</div>}

        {/* Form */}

        <form onSubmit={submit}>
          {/* Name */}

          <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />

          {/* Phone */}

          <Input
            label="Phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
          />

          {/* Email */}

          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          {/* Password */}

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
          />

          {/* Submit */}

          <Button type="submit" className="full" disabled={loading}>
            {loading ? "Creating account..." : "Continue →"}
          </Button>
        </form>

        {/* Footer */}

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
