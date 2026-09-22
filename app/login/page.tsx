"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!supabase) {
      setErrorMessage("Supabase belum dikonfigurasi. Silakan isi .env.local terlebih dahulu.");
      return;
    }

    const result = isSignUp
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setErrorMessage(
        result.error.message.toLowerCase().includes("invalid login credentials")
          ? "Email atau password salah, atau akun belum dibuat/diaktifkan. Pilih Create account untuk mendaftar."
          : result.error.message,
      );
      return;
    }

    if (isSignUp) {
      if (result.data.session) {
        router.push("/onboarding");
        return;
      }
      setSuccessMessage("Akun berhasil dibuat. Cek email Anda untuk konfirmasi akun sebelum login.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="text-lg font-black tracking-[0.28em] text-white">MILEZERO</Link>
            <Link href="/" className="text-sm text-zinc-400 transition hover:text-white">Back</Link>
          </div>
          <Link href="/admin/login" className="text-sm text-zinc-300 transition hover:text-white">
            Admin Portal
          </Link>
        </div>

        <div className="grid overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 md:grid-cols-2">
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 md:p-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
              Member access
            </p>
            <h1 className="text-4xl font-black tracking-tight">Run with your crew.</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-300">
              Sign in with your email to claim challenges, track your Miles, and grow your Runner Card.
            </p>

            <div className="mt-8 space-y-3 text-sm text-zinc-200">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold">1</span>
                Setup your profile
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold">2</span>
                Complete daily and weekly missions
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold">3</span>
                Accumulate Miles and rise through tiers
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-sm">
              <button type="button" onClick={() => setIsSignUp(false)} className={`rounded-full px-4 py-2 font-semibold ${!isSignUp ? "bg-white text-black" : "text-zinc-300"}`}>
                Sign in
              </button>
              <button type="button" onClick={() => setIsSignUp(true)} className={`rounded-full px-4 py-2 font-semibold ${isSignUp ? "bg-white text-black" : "text-zinc-300"}`}>
                Create account
              </button>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="6-12 letters and numbers"
                    minLength={6}
                    maxLength={12}
                    pattern="[A-Za-z0-9]{6,12}"
                    title="Password harus terdiri dari 6 sampai 12 huruf atau angka."
                    required
                    className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 pr-16 text-white outline-none placeholder:text-zinc-500"
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
                <p className="mt-2 text-xs text-zinc-500">6-12 karakter, hanya huruf dan angka.</p>
              </div>

              <button type="submit" className="block w-full rounded-2xl bg-[#e7f27a] px-4 py-3 text-center font-bold text-black transition hover:bg-[#d9e35b]">
                {isSignUp ? "Create account" : "Sign in"}
              </button>

              {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}
              {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}

              <p className="text-center text-xs text-zinc-400">
                {isSignUp ? "Already have an account? " : "New here? "}
                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-white underline">
                  {isSignUp ? "Sign in" : "Create account"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
