'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      setMsg(json.message || 'Error');
      return;
    }

    const { token, user } = json.data;
    localStorage.setItem('token', token);

    // cookie para middleware
    document.cookie = `role=${user.role}; Path=/; Max-Age=${60 * 60 * 24 * 7}`;

    router.push(next);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Iniciar sesión</h1>

      {msg && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">{msg}</div>}

      <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800">Entrar</button>

        <p className="text-sm text-gray-600">
          ¿No tienes cuenta? <a className="underline" href="/register">Regístrate</a>
        </p>
      </form>
    </div>
  );
}
