import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, loading } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await login(email, password);

      nav("/app/dashboard");
    } catch (error) {
      setError(error.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button type="button" className="back-button" onClick={() => nav(-1)}>
          <ArrowLeft size={21} />
        </button>

        <Link className="auth-brand" to="/">
          <span className="logo-mark"><img src="/assets/icon.jpg" alt="" /></span>
          <span className="app-name">Settle<span>G</span></span>
        </Link>

        <h1>Welcome back</h1>

        <p>Log in to continue splitting smarter.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={submit}>
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" className="full" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
