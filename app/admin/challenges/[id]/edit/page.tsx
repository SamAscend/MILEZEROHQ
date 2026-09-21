"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Challenge, getChallengeById, updateChallenge } from "@/lib/challenge-store";
import { updateChallengeInSupabase } from "@/lib/supabase-data";

export default function EditChallengePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const challenge = useMemo(() => getChallengeById(params.id), [params.id]);

  const [form, setForm] = useState<Challenge | null>(challenge);

  if (!challenge || !form) {
    return (
      <main className="min-h-screen bg-[#0b0b0d] px-4 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-2xl font-black">Challenge not found</h1>
          <Link href="/admin/challenges" className="mt-5 inline-block rounded-full bg-[#e7f27a] px-4 py-2 font-bold text-black">
            Back to challenges
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updates = {
      ...form,
      miles_reward: Number(form.miles_reward),
    };

    try {
      const updatedRemotely = await updateChallengeInSupabase(challenge.id, updates);
      if (updatedRemotely) {
        router.push("/admin/challenges");
        return;
      }
    } catch {
      // Keep local fallback behavior when Supabase is unavailable.
    }

    updateChallenge(challenge.id, updates);
    router.push("/admin/challenges");
  };

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-black">Edit challenge</h1>
          </div>
          <Link href="/admin/challenges" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
            Back
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Title</label>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Description</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="h-28 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Frequency</label>
              <select
                value={form.frequency}
                onChange={(event) => setForm({ ...form, frequency: event.target.value as Challenge["frequency"] })}
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Special">Special</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">Category</label>
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
              >
                <option value="Lari">Lari</option>
                <option value="Gym">Gym</option>
                <option value="Renang">Renang</option>
                <option value="Recovery">Recovery</option>
                <option value="Event">Event</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">Miles reward</label>
              <input
                type="number"
                min={1}
                value={form.miles_reward}
                onChange={(event) => setForm({ ...form, miles_reward: Number(event.target.value) })}
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
              />
            </div>

            <div className="flex items-end gap-3">
              <label className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-200">
                <input
                  type="checkbox"
                  checked={form.requires_proof}
                  onChange={(event) => setForm({ ...form, requires_proof: event.target.checked })}
                  className="h-4 w-4 accent-[#e7f27a]"
                />
                Requires proof
              </label>
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
              className="h-4 w-4 accent-[#e7f27a]"
            />
            Active challenge
          </label>

          <button type="submit" className="w-full rounded-2xl bg-[#e7f27a] px-4 py-3 font-bold text-black">
            Update challenge
          </button>
        </form>
      </div>
    </main>
  );
}
