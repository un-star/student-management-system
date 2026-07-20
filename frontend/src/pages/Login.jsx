import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Incorrect email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm border border-ink/10 rounded-lg p-10 w-full max-w-sm"
      >
        <h1 className="font-display text-3xl mb-1">Sign in</h1>
        <p className="text-ink/50 text-sm mb-8">Access the student registrar</p>

        {error && (
          <div className="bg-danger/10 text-danger text-sm rounded-md px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-ink/20 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brass"
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-ink/20 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-brass"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper rounded-md py-2 font-medium hover:bg-inklight transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
