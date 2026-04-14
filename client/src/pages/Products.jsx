import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http";
import Loader from "../components/Loader";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError("");
      try {
        const res = await http.get("/api/products");
        if (!alive) return;
        setItems(res.data || []);
      } catch (e) {
        if (!alive) return;
        setError(e?.response?.data?.message || "Failed to load products");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Products</h2>
          <p className="mt-2 text-sm text-zinc-400">Pick a flavor. Place an order in seconds.</p>
        </div>
        <Link
          to="/"
          className="hidden sm:inline rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
        >
          Back to Home
        </Link>
      </div>

      <div className="mt-8">
        {loading ? <Loader label="Loading products..." /> : null}
        {error ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p._id} className="glass overflow-hidden rounded-3xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-pulse.cyan/10 via-pulse.pink/10 to-pulse.lime/10" />
                <img
                  alt={p.name}
                  src={p.image}
                  className="relative h-56 w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold">{p.name}</div>
                    <div className="mt-1 text-xs text-zinc-400">{p.flavor}</div>
                  </div>
                  <div className="rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold">
                    ${Number(p.price).toFixed(2)}
                  </div>
                </div>

                <Link
                  to={`/order/${p._id}`}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-pulse.cyan via-pulse.pink to-pulse.lime px-4 py-3 text-sm font-semibold text-zinc-950 hover:brightness-110 transition"
                >
                  Order Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
            No products found. Run the backend seed:
            <span className="ml-2 font-mono text-zinc-100">npm run seed</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

