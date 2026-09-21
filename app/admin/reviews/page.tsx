"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProofSubmissions, ProofSubmission, updateProofStatus } from "@/lib/challenge-store";
import { listProofsFromSupabase, updateProofStatusInSupabase } from "@/lib/supabase-data";

export default function AdminReviewsPage() {
  const [submissions, setSubmissions] = useState<ProofSubmission[]>([]);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const remoteSubmissions = await listProofsFromSupabase();
        setSubmissions(remoteSubmissions ?? getProofSubmissions());
      } catch {
        setSubmissions(getProofSubmissions());
      }
    };

    void loadSubmissions();
  }, []);

  const setStatus = async (id: string, status: ProofSubmission["status"]) => {
    try {
      const updatedRemotely = await updateProofStatusInSupabase(id, status);
      if (updatedRemotely) {
        setSubmissions((current) => current.map((submission) => (submission.id === id ? { ...submission, status } : submission)));
        return;
      }
    } catch {
      // Keep local fallback behavior when Supabase is unavailable.
    }

    setSubmissions(updateProofStatus(id, status));
  };

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-black">Proof review</h1>
          </div>
          <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Overview</Link>
        </header>

        <div className="space-y-4">
          {submissions.map((row) => (
            <div key={row.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-bold">Member submission</p>
                  <p className="text-sm text-zinc-400">{row.challenge_title} | {row.file_name}</p>
                </div>
                <span className="rounded-full bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-300">{row.status}</span>
              </div>

              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setStatus(row.id, "Approved")} className="flex-1 rounded-2xl bg-[#e7f27a] px-4 py-2 font-bold text-black">Approve</button>
                <button type="button" onClick={() => setStatus(row.id, "Rejected")} className="rounded-2xl border border-white/10 px-4 py-2 text-sm">Reject</button>
              </div>
            </div>
          ))}
        </div>

        {submissions.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-zinc-300">
            No proof submissions yet.
          </div>
        )}
      </div>
    </main>
  );
}
