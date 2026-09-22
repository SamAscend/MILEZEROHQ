"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { CurrentProfile, getCurrentProfile, updateCurrentProfile } from "@/lib/supabase-data";

const stats = [
  { label: "Total Miles", value: "0" },
  { label: "Best Streak", value: "0 days" },
  { label: "Completion", value: "0%" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<CurrentProfile | null>(null);
  const [form, setForm] = useState({ display_name: "", username: "", bio: "" });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentProfile = await getCurrentProfile();
        setProfile(currentProfile);
        if (currentProfile) {
          setForm({
            display_name: currentProfile.display_name,
            username: currentProfile.username,
            bio: currentProfile.bio,
          });
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Profile gagal dimuat.");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      await updateCurrentProfile({ ...form, avatar_url: profile?.avatar_url ?? null });
      setProfile((current) => (current ? { ...current, ...form } : current));
      setMessage("Profile berhasil diperbarui.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Profile gagal disimpan.");
    }
  };

  if (loading) return <main className="min-h-screen bg-[#0b0b0d] p-8 text-white">Loading profile...</main>;

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#0b0b0d] px-4 pb-28 pt-8 text-white">
        <div className="mx-auto max-w-xl rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-2xl font-black">Belum login</h1>
          <p className="mt-3 text-zinc-400">Login untuk membuat dan mengedit profile Anda.</p>
          <Link href="/login" className="mt-6 inline-block rounded-full bg-[#e7f27a] px-5 py-3 font-bold text-black">Login</Link>
        </div>
        <BottomNav />
      </main>
    );
  }

  const initials = (form.display_name || profile.email || "U").slice(0, 2).toUpperCase();
  const profileStats = [stats[0], stats[1], stats[2]];

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 pb-28 pt-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Profile</p>
            <h1 className="mt-2 text-3xl font-black">Runner identity</h1>
          </div>
          <Link href="/notifications" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
            Notifications
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-700 text-xl font-black text-black">
                {initials}
              </div>
              <div>
                <p className="text-2xl font-black">{form.display_name || "No display name"}</p>
                <p className="text-sm text-zinc-400">{form.username ? `@${form.username.replace(/^@/, "")}` : "Username not set"}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-zinc-300">
              <p>Bio: {form.bio || "Not set"}</p>
              <p>Email: {profile.email}</p>
              <p>Tier: Starter</p>
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">Edit profile</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <input value={form.display_name} onChange={(event) => setForm({ ...form, display_name: event.target.value })} placeholder="Display name" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 outline-none" required />
              <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value.replace(/^@/, "") })} placeholder="Username" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 outline-none" />
              <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} placeholder="Short bio" className="h-24 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 outline-none" />
              <button type="submit" className="w-full rounded-2xl bg-[#e7f27a] px-4 py-3 font-bold text-black">Save profile</button>
              {message && <p className="text-sm text-emerald-300">{message}</p>}
              {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}
            </form>
            <h2 className="mt-7 text-xl font-bold">Overview</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {profileStats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-zinc-950/80 p-4">
                  <p className="text-sm text-zinc-400">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-[#e7f27a]">{item.label === "Total Miles" ? profile.miles : item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm text-zinc-300">
                  <span>Strength</span>
                  <span>0</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 w-0 rounded-full bg-[#e7f27a]" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm text-zinc-300">
                  <span>Endurance</span>
                  <span>0</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 w-0 rounded-full bg-[#e7f27a]" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm text-zinc-300">
                  <span>Recovery</span>
                  <span>0</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 w-0 rounded-full bg-[#e7f27a]" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
