import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import Order from "./pages/Order";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_55%),radial-gradient(circle_at_bottom,rgba(251,113,133,0.10),transparent_55%)]">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-3xl px-4 py-16">
                <div className="glass rounded-3xl p-8">
                  <div className="text-2xl font-bold">Page not found</div>
                  <p className="mt-2 text-zinc-400">That route doesn’t exist.</p>
                  <a
                    href="/"
                    className="mt-6 inline-flex rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 transition"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

