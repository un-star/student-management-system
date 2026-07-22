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
        err.response?.data?.detail ||
          "Cannot reach the registrar server. Check that the backend is running and the API URL is correct."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(39,94,254,0.14),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(214,139,31,0.16),_transparent_30%),var(--bg)]">
      <form
        onSubmit={handleSubmit}
        className="bg-surface/95 shadow-xl border border-ink/10 rounded-2xl p-6 sm:p-8 w-full max-w-md backdrop-blur"
      >
        <div className="inline-flex items-center rounded-full bg-info/10 px-3 py-1 text-info text-xs font-semibold mb-4">
          Registrar Portal
        </div>
        <h1 className="font-display text-3xl mb-2">Sign in</h1>
        <p className="text-ink/60 text-sm mb-8">
          Access the student registrar dashboard.
        </p>

        {error && (
          <div className="bg-danger/10 text-danger text-sm rounded-xl px-3 py-3 mb-4 border border-danger/15">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-ink/20 rounded-xl px-3 py-3 mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-info"
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-ink/20 rounded-xl px-3 py-3 mb-6 bg-white focus:outline-none focus:ring-2 focus:ring-info"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-info text-white rounded-xl py-3 font-semibold hover:brightness-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
