"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Challenge, createProofSubmission, getChallengeById, getProofSubmissions } from "@/lib/challenge-store";
import { getChallengeFromSupabase, submitProofToSupabase } from "@/lib/supabase-data";

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const remoteChallenge = await getChallengeFromSupabase(params.id);
        setChallenge(remoteChallenge ?? getChallengeById(params.id));
      } catch {
        setChallenge(getChallengeById(params.id));
      }
    };

    void loadChallenge();
  }, [params.id]);

  useEffect(() => {
    if (challenge) setSubmitted(getProofSubmissions().some((proof) => proof.challenge_id === challenge.id));
  }, [challenge]);

  const handleProofSubmit = async () => {
    if (!challenge || !proofFile) {
      setMessage("Choose a proof file first.");
      return;
    }

    try {
      const remoteSubmission = await submitProofToSupabase(challenge, proofFile);
      if (remoteSubmission) {
        setSubmitted(true);
        setMessage("Proof uploaded and waiting for admin review.");
        return;
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload proof.");
      return;
    }

    createProofSubmission({ challenge_id: challenge.id, challenge_title: challenge.title, file_name: proofFile.name });
    setSubmitted(true);
    setMessage("Proof submitted and waiting for admin review.");
  };

  if (!challenge) {
    return (
      <main className="min-h-screen bg-[#0b0b0d] px-4 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-2xl font-black">Challenge not found</h1>
          <Link href="/challenges" className="mt-5 inline-block rounded-full bg-[#e7f27a] px-4 py-2 font-bold text-black">
            Back to challenges
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Challenge</p>
            <h1 className="mt-2 text-3xl font-black">{challenge.title}</h1>
          </div>
          <Link href="/challenges" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
            Back
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="rounded-full bg-[#e7f27a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e7f27a]">
                {challenge.frequency}
              </span>
              <span className="text-sm text-zinc-400">{challenge.category}</span>
            </div>

            <p className="text-lg leading-8 text-zinc-300">{challenge.description}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
                <p className="text-sm text-zinc-400">Reward</p>
                <p className="mt-2 text-2xl font-black text-[#e7f27a]">{challenge.miles_reward} Miles</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
                <p className="text-sm text-zinc-400">Proof required</p>
                <p className="mt-2 text-2xl font-black text-[#e7f27a]">{challenge.requires_proof ? "Yes" : "No"}</p>
              </div>
            </div>

            <button type="button" className="mt-8 w-full rounded-2xl bg-[#e7f27a] px-4 py-3 font-bold text-black">
              Complete challenge
            </button>
          </section>

          <aside className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">Upload proof</h2>

            <label className="mt-5 block rounded-[24px] border border-dashed border-white/20 bg-zinc-950/70 p-6 text-center text-sm text-zinc-300">
              <input
                type="file"
                className="hidden"
                onChange={(event) => setProofFile(event.target.files?.[0] ?? null)}
              />
              {proofFile ? proofFile.name : "Click to choose image or PDF"}
            </label>

            <button
              type="button"
              onClick={handleProofSubmit}
              disabled={submitted}
              className="mt-4 w-full rounded-2xl bg-[#e7f27a] px-4 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitted ? "Proof submitted" : "Submit proof"}
            </button>

            {message && <p className="mt-3 text-sm text-[#e7f27a]">{message}</p>}

            <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-950/70 p-4 text-sm text-zinc-300">
              <p className="font-semibold text-white">Approval status</p>
              <p className="mt-2">{submitted ? "Pending review" : "No proof submitted"}</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
