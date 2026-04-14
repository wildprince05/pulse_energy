import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function Signup() {
  const { signup, loading, error, isAuthed } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthed) navigate("/products");
  }, [isAuthed, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    const ok = await signup(email, password);
    if (ok) navigate("/products");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="glass rounded-3xl p-6">
        <h2 className="text-2xl font-bold">Create account</h2>
        <p className="mt-1 text-sm text-zinc-400">Only gmail addresses are accepted.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-zinc-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@gmail.com"
              className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm outline-none focus:border-pulse.cyan/60"
              required
            />
          </div>
          <div>
            <label className="text-sm text-zinc-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="At least 6 characters"
              className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm outline-none focus:border-pulse.pink/60"
              required
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-pulse.cyan via-pulse.pink to-pulse.lime px-5 py-3 text-sm font-semibold text-zinc-950 hover:brightness-110 disabled:opacity-60 transition"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link className="text-white hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

