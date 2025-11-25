"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // si pasas ?next=/admin por ejemplo
  const nextUrl = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setError(data?.message || "Credenciales inválidas");
        return;
      }

      // ✅ ajusta al nombre real que devuelve tu backend
      const token = data?.data?.token || data?.token;
      if (token) localStorage.setItem("token", token);

      router.push(nextUrl);
      router.refresh();
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
            {error}
          </div>
        )}

        <label className="block text-sm mb-1">Email</label>
        <input
          className="w-full mb-3 border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          className="w-full mb-4 border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <button
          disabled={loading}
          className="w-full py-2 rounded bg-black text-white disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
