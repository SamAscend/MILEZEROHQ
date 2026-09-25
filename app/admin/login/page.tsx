"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { recordAdminActivity } from "@/lib/admin-activity";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setErrorMessage(result?.error ?? `Login admin gagal (HTTP ${response.status}).`);
        return;
      }

      recordAdminActivity({
        kind: "login",
        actor: username,
        action: "Admin signed in",
        device: navigator.userAgent,
      });
      recordAdminActivity({
        kind: "audit",
        actor: username,
        action: "Admin login successful",
        device: navigator.userAgent,
      });
      const nextPath = searchParams.get("next");
      router.push(nextPath?.startsWith("/admin") ? nextPath : "/admin");
    } catch {
      setErrorMessage("Tidak dapat terhubung ke server login. Pastikan deployment Vercel sudah selesai dan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b0d] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin Portal</p>
        <h1 className="mt-4 text-3xl font-black">Secure login</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Username</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-[#e7f27a]/60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="password-input w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 pr-16 text-white outline-none focus:border-[#e7f27a]/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 hover:text-white"
              >
                {showPassword ? (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 4.2A10.8 10.8 0 0112 4c5.2 0 8.7 4 9.8 6a11.8 11.8 0 01-3.1 3.8M6.2 6.2C4.4 7.4 3.2 9 2.2 10c1.1 2 4.6 6 9.8 6 1 0 2-.2 2.8-.5" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                    <path d="M2.2 10c1.1-2 4.6-6 9.8-6s8.7 4 9.8 6c-1.1 2-4.6 6-9.8 6s-8.7-4-9.8-6z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500">Password admin bersifat case-sensitive.</p>
          </div>

          <button type="submit" disabled={isSubmitting} className="block w-full rounded-2xl bg-[#e7f27a] px-4 py-3 text-center font-bold text-black disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}

          <Link href="/login" className="block text-center text-sm text-zinc-400 underline">
            Back to member login
          </Link>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0b0b0d]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
