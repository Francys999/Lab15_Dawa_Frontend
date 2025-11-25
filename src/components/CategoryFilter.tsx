'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types/product';

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get('category') || '';

  return (
    <select
      className="border rounded px-3 py-2"
      value={current}
      onChange={(e) => {
        const v = e.target.value;
        const url = v ? `/?category=${v}` : '/';
        router.push(url);
      }}
    >
      <option value="">Todas las categorías</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nombre}
        </option>
      ))}
    </select>
  );
}
