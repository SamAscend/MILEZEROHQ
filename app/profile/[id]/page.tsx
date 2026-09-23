"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { CurrentProfile, getPublicProfile } from "@/lib/supabase-data";

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const [profile, setProfile] = useState<CurrentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await getPublicProfile(params.id);
        setProfile(result);
        if (!result) setErrorMessage("Profile tidak ditemukan.");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Profile gagal dimuat.");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [params.id]);

  if (loading) return <main className="min-h-screen bg-[#0b0b0d] p-8 text-white">Loading profile...</main>;

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#0b0b0d] px-4 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-2xl font-black">Profile unavailable</h1>
          <p className="mt-3 text-zinc-300">{errorMessage || "Profile tidak ditemukan."}</p>
          <Link href="/leaderboard" className="mt-6 inline-block rounded-full bg-[#e7f27a] px-5 py-3 font-bold text-black">Back to leaderboard</Link>
        </div>
        <BottomNav />
      </main>
    );
  }

  const initials = (profile.display_name || "U").slice(0, 2).toUpperCase();
  const joinedDate = new Date(profile.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 pb-28 pt-8 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Runner profile</p><h1 className="mt-2 text-3xl font-black">{profile.display_name || "Unnamed runner"}</h1></div>
          <Link href="/leaderboard" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Back</Link>
        </header>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#e7f27a] to-zinc-500 text-3xl font-black text-black">
              {profile.avatar_url ? <img src={profile.avatar_url} alt={`${profile.display_name} avatar`} className="h-full w-full object-cover" /> : initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3"><h2 className="text-3xl font-black">{profile.display_name || "Unnamed runner"}</h2><span className="rounded-full border border-[#e7f27a]/50 bg-[#e7f27a]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[#e7f27a]">{profile.role}</span></div>
              <p className="mt-2 text-zinc-400">{profile.username ? `@${profile.username}` : "Runner"}</p>
              <p className="mt-4 max-w-xl text-zinc-300">{profile.bio || "This runner has not added a bio yet."}</p>
              <p className="mt-4 text-sm text-zinc-400">Joined {joinedDate}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-zinc-950/80 p-4"><p className="text-sm text-zinc-400">Miles</p><p className="mt-2 text-2xl font-black text-[#e7f27a]">{profile.miles}</p></div>
            <div className="rounded-2xl bg-zinc-950/80 p-4"><p className="text-sm text-zinc-400">Challenges joined</p><p className="mt-2 text-2xl font-black text-[#e7f27a]">{profile.challenge_count}</p></div>
            <div className="rounded-2xl bg-zinc-950/80 p-4"><p className="text-sm text-zinc-400">Role</p><p className="mt-2 text-2xl font-black capitalize text-[#e7f27a]">{profile.role}</p></div>
          </div>
        </section>
      </div>
      <BottomNav />
    </main>
  );
}
