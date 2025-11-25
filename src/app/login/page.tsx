import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic"; // ayuda a evitar prerender estático

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando...</div>}>
      <LoginClient />
    </Suspense>
  );
}
