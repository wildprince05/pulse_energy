import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-pulse.cyan/20 via-pulse.pink/20 to-pulse.lime/20 blur-2xl" />
          <div className="glass relative overflow-hidden rounded-3xl p-6">
            <img
              className="mx-auto max-h-[420px] w-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
              alt="Pulse Energy can"
              src="https://images.unsplash.com/photo-1622480916113-9000c0b4bcd0?auto=format&fit=crop&w=900&q=80"
            />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-pulse.cyan" />
            New drop: Original Pulse Energy
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
            The Original <span className="text-transparent bg-clip-text bg-gradient-to-r from-pulse.cyan via-pulse.pink to-pulse.lime">Pulse Energy</span>
          </h1>

          <p className="mt-4 text-zinc-300 leading-relaxed">
            Clean flavor. Loud energy. Built for late nights, early mornings, and everything in between.
            Choose your vibe—Original, Sugarfree, Tropical, or Berry.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-gradient-to-r from-pulse.cyan via-pulse.pink to-pulse.lime px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-pulse.pink/20 hover:brightness-110 transition"
            >
              Shop Products
            </Link>
            <Link
              to="/signup"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Create account
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              { k: "4", v: "Signature flavors" },
              { k: "7d", v: "Token session" },
              { k: "⚡", v: "Fast checkout" }
            ].map((x) => (
              <div key={x.v} className="glass rounded-2xl px-3 py-4">
                <div className="text-xl font-bold">{x.k}</div>
                <div className="mt-1 text-xs text-zinc-400">{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

