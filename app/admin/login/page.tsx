"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMessage(error.message);
        return;
      }
    } else {
      setErrorMessage("Supabase belum dikonfigurasi. Admin login belum tersedia.");
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b0d] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin Portal</p>
        <h1 className="mt-4 text-3xl font-black">Secure login</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                maxLength={12}
                pattern="[A-Za-z0-9]{6,12}"
                title="Password harus terdiri dari 6 sampai 12 huruf atau angka."
                required
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 pr-16 text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm text-zinc-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500">6-12 karakter, hanya huruf dan angka.</p>
          </div>

          <button type="submit" className="block w-full rounded-2xl bg-[#e7f27a] px-4 py-3 text-center font-bold text-black">
            Sign in
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
