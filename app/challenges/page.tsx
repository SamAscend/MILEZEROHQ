"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Challenge, getStoredChallenges } from "@/lib/challenge-store";
import { listChallengesFromSupabase } from "@/lib/supabase-data";
import { supabase } from "@/lib/supabase";

const tabs = ["Daily", "Weekly", "Monthly", "Special"] as const;

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Daily");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [authLoading, setAuthLoading] = useState(() => Boolean(supabase));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const authClient = supabase;

    const loadSession = async () => {
      const { data } = await authClient.auth.getSession();
      setIsAuthenticated(Boolean(data.session));
      setAuthLoading(false);
    };

    void loadSession();
    const { data: listener } = authClient.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadChallenges = async () => {
      try {
        const remoteChallenges = await listChallengesFromSupabase();
        setChallenges(remoteChallenges && remoteChallenges.length > 0 ? remoteChallenges : getStoredChallenges());
      } catch {
        setChallenges(getStoredChallenges());
      }
    };

    void loadChallenges();
  }, [isAuthenticated]);

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

        {authLoading && <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-zinc-300">Checking your session...</div>}

        {!authLoading && !isAuthenticated && (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-xl font-bold">Login to view challenges</h2>
            <p className="mt-2 text-sm text-zinc-400">Available missions will appear after you sign in.</p>
            <Link href="/login" className="mt-5 inline-block rounded-full bg-[#e7f27a] px-5 py-3 font-bold text-black">Login</Link>
          </div>
        )}

        {isAuthenticated && <div className="mb-8 flex flex-wrap gap-3">
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
        </div>}

        {isAuthenticated && <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
        </div>}

        {isAuthenticated && visibleChallenges.length === 0 && (
          <div className="mt-8 rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-zinc-300">
            No active challenges for this category yet.
          </div>
        )}
      </div>
    </main>
  );
}
