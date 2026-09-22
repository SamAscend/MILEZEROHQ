"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { supabase } from "@/lib/supabase";

const features = [
  { title: "Daily Challenges", description: "Short missions that keep crew momentum high." },
  { title: "Runner Card", description: "Track your level, Miles, stats, and achievements." },
  { title: "Crew Leaderboard", description: "See who is climbing faster each week." },
  { title: "Admin Review", description: "Proof-based validation for integrity and fairness." },
];

const milestones = [
  { label: "Mile 0", value: "Starter" },
  { label: "Mile 50", value: "Pacer" },
  { label: "Mile 150", value: "Sprinter" },
  { label: "Mile 300", value: "Elite" },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => setIsLoggedIn(Boolean(data.session)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setIsLoggedIn(Boolean(session)));
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <main className="min-h-screen bg-[#0b0b0d] text-white">
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-8">
        <header className="mb-12 flex items-center justify-between">
          <div className="text-lg font-black tracking-[0.28em] text-white">MILEZERO</div>
          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/challenges">Challenges</Link>
            <Link href="/leaderboard">Leaderboard</Link>
            <Link href="/admin/login">Admin</Link>
          </nav>
          {isLoggedIn ? (
            <button type="button" onClick={handleLogout} className="rounded-full bg-[#e7f27a] px-4 py-2 text-sm font-bold text-black">Log out</button>
          ) : (
            <Link href="/login" className="rounded-full bg-[#e7f27a] px-4 py-2 text-sm font-bold text-black">Login</Link>
          )}
        </header>

        <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-300">
              Started with five.
            </p>
            <h1 className="max-w-xl text-5xl font-black leading-[0.95] tracking-[-0.06em] md:text-7xl">
              Your crew. Your miles. Your next level.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
              A runner-focused gamification platform for MileZero crews to complete challenges, track progress, unlock tiers, and build a stronger training culture.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/login" className="rounded-full bg-[#e7f27a] px-6 py-3 font-bold text-black transition hover:bg-[#dfe96d]">
                Join member portal
              </Link>
              <Link href="/admin/login" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold text-white transition hover:bg-white/10">
                Admin portal
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 shadow-2xl shadow-black/40">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Runner Card</p>
                <h2 className="mt-2 text-2xl font-black">Your Runner Card</h2>
              </div>
              <span className="rounded-full border border-[#e7f27a] bg-[#e7f27a]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#e7f27a]">
                Starter
              </span>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-zinc-400">
                <span>Mile Marker</span>
                <span className="text-[#e7f27a]">Mile 0</span>
              </div>
              <div className="h-2.5 rounded-full bg-zinc-800">
                <div className="h-2.5 w-0 rounded-full bg-[#e7f27a]" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-zinc-950 p-3">
                  <p className="text-zinc-400">STR</p>
                  <p className="mt-1 text-xl font-black">0</p>
                </div>
                <div className="rounded-2xl bg-zinc-950 p-3">
                  <p className="text-zinc-400">AGI</p>
                  <p className="mt-1 text-xl font-black">0</p>
                </div>
                <div className="rounded-2xl bg-zinc-950 p-3">
                  <p className="text-zinc-400">VIT</p>
                  <p className="mt-1 text-xl font-black">0</p>
                </div>
                <div className="rounded-2xl bg-zinc-950 p-3">
                  <p className="text-zinc-400">INT</p>
                  <p className="mt-1 text-xl font-black">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111214] py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Why MileZero</p>
            <h2 className="mt-3 text-4xl font-black">Designed for consistency, crew energy, and progress.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="mb-5 h-12 w-12 rounded-2xl bg-[#e7f27a]" />
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Progression</p>
          <h2 className="mt-3 text-4xl font-black">From Mile 0 to elite.</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {milestones.map((milestone) => (
            <div key={milestone.label} className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-sm text-zinc-400">{milestone.label}</p>
              <p className="mt-4 text-3xl font-black text-[#e7f27a]">{milestone.value}</p>
            </div>
          ))}
        </div>
      </section>
      <BottomNav />
    </main>
  );
}
