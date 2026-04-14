import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { http, setAuthToken } from "../api/http";

const AuthContext = createContext(null);

const LS_KEY = "pulse_token";
const LS_USER = "pulse_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(LS_KEY) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(LS_USER);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthToken(token || "");
    if (token) localStorage.setItem(LS_KEY, token);
    else localStorage.removeItem(LS_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  }, [user]);

  async function signup(email, password) {
    setLoading(true);
    setError("");
    try {
      const res = await http.post("/api/auth/signup", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return true;
    } catch (e) {
      setError(e?.response?.data?.message || "Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    setLoading(true);
    setError("");
    try {
      const res = await http.post("/api/auth/login", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return true;
    } catch (e) {
      setError(e?.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setUser(null);
  }

  const value = useMemo(
    () => ({ token, user, loading, error, signup, login, logout, isAuthed: !!token }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

