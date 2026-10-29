import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { SEED } from "./seed";
import type { Role, Store, User } from "./types";

const STORE_KEY = "uc_store_v1";
const SESSION_KEY = "uc_session";

interface Ctx {
  ready: boolean;
  store: Store;
  user: User | null;
  update: (fn: (s: Store) => Partial<Store>) => void;
  login: (email: string, password: string) => string | null;
  register: (data: { name: string; email: string; password: string; role: Role }) => string | null;
  logout: () => void;
}

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(SEED);
  const [userId, setUserId] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setStore(JSON.parse(raw) as Store);
      const sid = localStorage.getItem(SESSION_KEY);
      if (sid) setUserId(Number(sid));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }, [store, ready]);

  const update = useCallback((fn: (s: Store) => Partial<Store>) => {
    setStore((prev) => ({ ...prev, ...fn(prev) }));
  }, []);

  const startSession = (id: number) => {
    setUserId(id);
    localStorage.setItem(SESSION_KEY, String(id));
  };

  const login = (email: string, password: string) => {
    const u = store.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!u || u.password !== password) return "Incorrect email or password.";
    startSession(u.id);
    return null;
  };

  const register: Ctx["register"] = (data) => {
    if (store.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase()))
      return "An account with this email already exists.";
    if (data.password.length < 8) return "Password must be at least 8 characters.";
    const id = Math.max(0, ...store.users.map((u) => u.id)) + 1;
    update((s) => ({ users: [...s.users, { id, ...data, location: "Egypt" }] }));
    startSession(id);
    return null;
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const user = store.users.find((u) => u.id === userId) ?? null;

  return (
    <StoreContext.Provider value={{ ready, store, user, update, login, register, logout }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useApp must be used inside StoreProvider");
  return ctx;
}

export const fmt = (n: number) => new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(n);
export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-EG", { month: "short", day: "numeric", year: "numeric" });
export const ago = (d: string) => {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
