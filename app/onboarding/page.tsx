"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const avatarOptions = ["A", "B", "C", "D", "E", "F"];

export default function OnboardingPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("A");
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    if (!agreed) {
      setErrorMessage("Setujui privacy notice terlebih dahulu.");
      return;
    }
    if (!supabase) {
      setErrorMessage("Supabase belum dikonfigurasi.");
      return;
    }

    setSaving(true);
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      setErrorMessage("Sesi login tidak ditemukan. Silakan login kembali.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: authData.user.id,
        display_name: displayName.trim(),
        username: username.trim().replace(/^@/, ""),
        bio: bio.trim(),
        avatar_url: avatar,
      }, { onConflict: "id" });

    setSaving(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b0d] px-4 py-10 text-white">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Onboarding</p>
        <h1 className="mt-4 text-3xl font-black">Build your Runner Card</h1>

        <div className="mt-6 space-y-5">
          <div className="flex flex-col items-center gap-4 rounded-[28px] border border-white/10 bg-zinc-950/60 p-5 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#e7f27a] to-[#c8d65f] text-2xl font-black text-black">
              {avatar}
            </div>
            <div className="flex flex-wrap gap-2">
              {avatarOptions.map((avatarOption) => (
                <button
                  key={avatarOption}
                  type="button"
                  onClick={() => setAvatar(avatarOption)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                      avatar === avatarOption
                      ? "border-[#e7f27a] bg-[#e7f27a] text-black"
                      : "border-white/10 bg-white/5 text-white"
                  }`}
                >
                  {avatarOption}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Display name</label>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Your display name" required className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Username</label>
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Choose a username" required className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Short bio</label>
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Tell the crew about yourself" className="h-28 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
          </div>

          <div className="rounded-[24px] border border-white/10 bg-zinc-950/60 p-4 text-sm leading-7 text-zinc-300">
            <p className="font-semibold text-white">Privacy notice</p>
            <p className="mt-2">
              Your profile data, including name, username, email account, and challenge history, may be visible to the admin team for moderation, monitoring, and safety purposes.
            </p>
          </div>

          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="h-4 w-4 accent-[#e7f27a]" />
            I agree to the privacy notice and allow the admin team to access my profile and challenge history.
          </label>

          <button type="submit" disabled={saving} className="block w-full rounded-2xl bg-[#e7f27a] px-4 py-3 text-center font-bold text-black transition hover:bg-[#dfe96d] disabled:opacity-50">
            {saving ? "Saving..." : "Save profile"}
          </button>
          {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
