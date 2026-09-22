"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Language = "id" | "en";
type Theme = "dark" | "light";

export default function SettingsPage() {
  const [language, setLanguage] = useState<Language>("id");
  const [theme, setTheme] = useState<Theme>("dark");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("milezero-language") as Language | null;
    const savedTheme = window.localStorage.getItem("milezero-theme") as Theme | null;
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTheme) setTheme(savedTheme);
    document.documentElement.dataset.theme = savedTheme ?? "dark";
  }, []);

  const updateLanguage = (value: Language) => {
    setLanguage(value);
    window.localStorage.setItem("milezero-language", value);
  };

  const updateTheme = (value: Theme) => {
    setTheme(value);
    window.localStorage.setItem("milezero-theme", value);
    document.documentElement.dataset.theme = value;
  };

  const updatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (!supabase) {
      setMessage("Supabase belum dikonfigurasi.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? error.message : "Password berhasil diubah.");
    if (!error) setPassword("");
  };

  const labels = language === "id"
    ? { title: "Pengaturan", language: "Bahasa", theme: "Tampilan", profile: "Edit profile", password: "Ganti password", save: "Simpan password", dark: "Mode gelap", light: "Mode terang" }
    : { title: "Settings", language: "Language", theme: "Appearance", profile: "Edit profile", password: "Change password", save: "Save password", dark: "Dark mode", light: "Light mode" };

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 flex items-center justify-between">
          <div><p className="text-xs uppercase tracking-[0.35em] text-zinc-500">MileZero</p><h1 className="mt-2 text-3xl font-black">{labels.title}</h1></div>
          <Link href="/profile" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Back</Link>
        </header>

        <div className="space-y-5">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-bold">{labels.language}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => updateLanguage("id")} className={`rounded-2xl border px-4 py-3 text-left ${language === "id" ? "border-[#e7f27a] bg-[#e7f27a]/10" : "border-white/10 bg-zinc-950"}`}>Bahasa Indonesia</button>
              <button type="button" onClick={() => updateLanguage("en")} className={`rounded-2xl border px-4 py-3 text-left ${language === "en" ? "border-[#e7f27a] bg-[#e7f27a]/10" : "border-white/10 bg-zinc-950"}`}>English</button>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-bold">{labels.theme}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => updateTheme("dark")} className={`rounded-2xl border px-4 py-3 text-left ${theme === "dark" ? "border-[#e7f27a] bg-[#e7f27a]/10" : "border-white/10 bg-zinc-950"}`}>{labels.dark}</button>
              <button type="button" onClick={() => updateTheme("light")} className={`rounded-2xl border px-4 py-3 text-left ${theme === "light" ? "border-[#e7f27a] bg-[#e7f27a]/10" : "border-white/10 bg-zinc-950"}`}>{labels.light}</button>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <Link href="/profile" className="block rounded-2xl bg-[#e7f27a] px-4 py-3 text-center font-bold text-black">{labels.profile}</Link>
          </section>

          <form onSubmit={updatePassword} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-bold">{labels.password}</h2>
            <input type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 6 characters" className="mt-4 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 outline-none" />
            <button type="submit" className="mt-4 rounded-2xl bg-[#e7f27a] px-4 py-3 font-bold text-black">{labels.save}</button>
            {message && <p className="mt-3 text-sm text-zinc-300">{message}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
