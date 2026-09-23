"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Challenge, getStoredChallenges } from "@/lib/challenge-store";
import { listChallengesFromSupabase } from "@/lib/supabase-data";

const tabs = ["Daily", "Weekly", "Monthly", "Special"] as const;

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Daily");
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const remoteChallenges = await listChallengesFromSupabase();
        setChallenges(remoteChallenges ?? getStoredChallenges());
      } catch {
        setChallenges(getStoredChallenges());
      }
    };

    void loadChallenges();
  }, []);

  const visibleChallenges = useMemo(
    () => challenges.filter((challenge) => challenge.frequency === activeTab && challenge.is_active),
    [activeTab, challenges],
  );

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Challenges</p>
            <h1 className="mt-2 text-3xl font-black">Claim your mission</h1>
          </div>
        </header>

        <div className="mb-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeTab === tab ? "bg-white text-black" : "border border-white/10 bg-white/5 text-zinc-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleChallenges.map((challenge) => (
            <div key={challenge.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-zinc-900 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
                  {challenge.category}
                </span>
                <span className="text-xs text-[#e7f27a]">{challenge.miles_reward} Miles</span>
              </div>
              <h2 className="text-xl font-bold">{challenge.title}</h2>
              <p className="mt-3 text-sm text-zinc-400">
                {challenge.requires_proof ? "Requires proof upload for approval." : "No proof required for this challenge."}
              </p>
              <div className="mt-6 flex gap-3">
                <Link href={`/challenge/${challenge.id}`} className="flex-1 rounded-2xl bg-white px-4 py-2 text-center font-semibold text-black">
                  Details
                </Link>
                {challenge.requires_proof && (
                  <Link href={`/challenge/${challenge.id}`} className="rounded-2xl border border-white/10 px-4 py-2 text-sm">
                    Upload
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {visibleChallenges.length === 0 && (
          <div className="mt-8 rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-zinc-300">
            No active challenges for this category yet.
          </div>
        )}
      </div>
    </main>
  );
}
