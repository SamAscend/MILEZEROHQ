"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Challenge, deleteChallenge, getStoredChallenges, updateChallenge } from "@/lib/challenge-store";
import { deleteChallengeFromSupabase, listChallengesFromSupabase, updateChallengeInSupabase } from "@/lib/supabase-data";

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const remoteChallenges = await listChallengesFromSupabase();
        setChallenges(remoteChallenges && remoteChallenges.length > 0 ? remoteChallenges : getStoredChallenges());
      } catch {
        setChallenges(getStoredChallenges());
      }
    };

    void loadChallenges();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const deletedRemotely = await deleteChallengeFromSupabase(id);
      if (deletedRemotely) {
        setChallenges((current) => current.filter((challenge) => challenge.id !== id));
        return;
      }
    } catch {
      // Keep local fallback behavior when Supabase is unavailable.
    }

    setChallenges(deleteChallenge(id));
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    let updated = null;
    try {
      updated = await updateChallengeInSupabase(id, { is_active });
    } catch {
      updated = null;
    }

    if (!updated) updated = updateChallenge(id, { is_active });
    if (updated) {
      setChallenges((current) => current.map((challenge) => (challenge.id === id ? updated : challenge)));
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-black">Challenges</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Overview</Link>
            <Link href="/admin/challenges/new" className="rounded-full bg-[#e7f27a] px-4 py-2 text-sm font-bold text-black">+ New</Link>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-[#e7f27a]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e7f27a]">
                  {challenge.frequency}
                </span>
                <span className="text-xs text-zinc-400">{challenge.is_active ? "Active" : "Draft"}</span>
              </div>

              <h2 className="text-xl font-bold">{challenge.title}</h2>
              <p className="mt-3 text-sm text-zinc-400">{challenge.category}</p>
              <p className="mt-4 text-sm">Reward: {challenge.miles_reward} Miles</p>
              <p className="mt-2 text-xs text-zinc-500">{challenge.requires_proof ? "Proof required" : "No proof required"}</p>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                <span>Status</span>
                <button
                  type="button"
                  onClick={() => toggleActive(challenge.id, !challenge.is_active)}
                  className="rounded-full border border-white/10 bg-white/5 px-2 py-1 font-semibold text-white"
                >
                  {challenge.is_active ? "On" : "Off"}
                </button>
              </div>

              <div className="mt-6 flex gap-2">
                <Link href={`/admin/challenges/${challenge.id}/edit`} className="flex-1 rounded-2xl bg-white px-3 py-2 text-center text-sm font-semibold text-black">
                  Edit
                </Link>
                <Link href={`/challenge/${challenge.id}`} className="flex-1 rounded-2xl bg-white px-3 py-2 text-center text-sm font-semibold text-black">
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(challenge.id)}
                  className="rounded-2xl border border-white/10 px-3 py-2 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
