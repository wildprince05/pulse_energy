import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { http } from "../api/http";
import Loader from "../components/Loader";
import { useAuth } from "../state/AuthContext";

export default function Order() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthed } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const total = useMemo(() => {
    const p = product?.price ? Number(product.price) : 0;
    const q = Number(quantity) || 0;
    return Number((p * q).toFixed(2));
  }, [product, quantity]);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError("");
      try {
        const res = await http.get("/api/products");
        const found = (res.data || []).find((x) => x._id === id);
        if (!alive) return;
        if (!found) {
          setError("Product not found");
          setProduct(null);
        } else {
          setProduct(found);
        }
      } catch (e) {
        if (!alive) return;
        setError(e?.response?.data?.message || "Failed to load product");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [id]);

  async function placeOrder() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (!isAuthed) {
        navigate("/login", { state: { from: `/order/${id}` } });
        return;
      }
      const res = await http.post("/api/orders", { productId: id, quantity: Number(quantity) });
      setSuccess(`Order placed! Total $${Number(res.data.totalPrice).toFixed(2)}`);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to place order");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight">Order</h2>
        <Link
          to="/products"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
        >
          Back
        </Link>
      </div>

      {loading ? (
        <div className="mt-8">
          <Loader label="Loading product..." />
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      {!loading && product ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="glass overflow-hidden rounded-3xl">
            <img alt={product.name} src={product.image} className="h-80 w-full object-cover" />
            <div className="p-6">
              <div className="text-xl font-bold">{product.name}</div>
              <div className="mt-1 text-sm text-zinc-400">{product.flavor}</div>
              <div className="mt-4 inline-flex rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold">
                ${Number(product.price).toFixed(2)} / can
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="text-lg font-bold">Checkout</div>
            <p className="mt-1 text-sm text-zinc-400">Choose quantity, confirm total, place order.</p>

            <div className="mt-6">
              <label className="text-sm text-zinc-300">Quantity</label>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, Number(q) - 1))}
                  className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
                >
                  -
                </button>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                  type="number"
                  min="1"
                  className="h-11 w-28 rounded-xl border border-white/10 bg-zinc-900/60 px-4 text-sm outline-none focus:border-pulse.cyan/60"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Number(q) + 1)}
                  className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <div>
                <div className="text-xs text-zinc-400">Total</div>
                <div className="text-2xl font-extrabold">${total.toFixed(2)}</div>
              </div>
              <div className="text-xs text-zinc-500">auto-calculated</div>
            </div>

            <button
              onClick={placeOrder}
              disabled={saving}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-pulse.cyan via-pulse.pink to-pulse.lime px-5 py-3 text-sm font-semibold text-zinc-950 hover:brightness-110 disabled:opacity-60 transition"
            >
              {saving ? "Placing..." : "Place Order"}
            </button>

            <div className="mt-4 text-xs text-zinc-500">
              Orders require login and a valid JWT (sent as a Bearer token).
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

