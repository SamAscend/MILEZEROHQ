"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminMember, getAdminStatsFromSupabase } from "@/lib/supabase-data";

const emptySummary = [
  { label: "Active members", value: "0" },
  { label: "Challenge completions", value: "0" },
  { label: "Pending proof", value: "0" },
  { label: "Avg. streak", value: "0d" },
];

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(emptySummary);
  const [memberRows, setMemberRows] = useState<AdminMember[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [stats, membersResponse] = await Promise.allSettled([getAdminStatsFromSupabase(), fetch("/api/admin/members")]);
        if (stats.status === "fulfilled" && stats.value) {
          setSummary([
            { label: "Active members", value: String(stats.value.activeMembers) },
            { label: "Challenge completions", value: String(stats.value.completions) },
            { label: "Pending proof", value: String(stats.value.pendingProof) },
            { label: "Avg. streak", value: stats.value.averageStreak },
          ]);
        }
        if (membersResponse.status === "rejected") throw membersResponse.reason;
        const response = membersResponse.value;
        const membersResult = await response.json();
        if (!response.ok) throw new Error(membersResult.error ?? "Members gagal dimuat.");
        const members = (membersResult.members ?? []).map((member: { id: string; display_name: string | null; miles: number; role: "member" | "admin" }) => ({
          id: member.id,
          name: member.display_name ?? "Unnamed member",
          email: "",
          miles: member.miles,
          role: member.role,
        }));
        setMemberRows(members);
      } catch {
        setSummary(emptySummary);
        setMemberRows([]);
      }
    };

    void loadDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-black">Crew operations</h1>
          </div>
          <Link href="/admin/challenges/new" className="rounded-full bg-[#e7f27a] px-4 py-2 text-sm font-bold text-black">Create challenge</Link>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {summary.map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-zinc-400">{item.label}</p>
              <p className="mt-3 text-3xl font-black">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-bold">Members</h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-black/20 text-sm text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Miles</th>
                    <th className="px-4 py-3">Tier</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {memberRows.map((member) => (
                    <tr key={member.id} className="border-t border-white/10">
                      <td className="px-4 py-3"><Link href={`/profile/${member.id}`} className="transition hover:text-[#e7f27a]">{member.name}</Link></td>
                      <td className="px-4 py-3">{member.miles}</td>
                      <td className="px-4 py-3">Member</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {memberRows.length === 0 && <p className="p-5 text-sm text-zinc-400">Belum ada member yang mendaftar.</p>}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-bold">Proof review queue</h2>
            <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950/80 p-5 text-sm text-zinc-400">
              Buka halaman Reviews untuk melihat bukti yang benar-benar dikirim member.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
