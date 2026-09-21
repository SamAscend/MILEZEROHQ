"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminMember, listMembersFromSupabase } from "@/lib/supabase-data";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<AdminMember[]>([]);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setMembers((await listMembersFromSupabase()) ?? []);
      } catch {
        setMembers([]);
      }
    };

    void loadMembers();
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-black">Members</h1>
          </div>
          <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Back to overview</Link>
        </header>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-sm text-zinc-400">
              <tr>
                <th className="px-5 py-4">Member</th>
                <th className="px-5 py-4">Tier</th>
                <th className="px-5 py-4">Miles</th>
                <th className="px-5 py-4">Streak</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t border-white/10">
                  <td className="px-5 py-4">
                    <Link href={`/admin/members/${member.id}`} className="flex items-center gap-3 font-semibold text-white">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f27a] text-sm font-black text-black">
                        {member.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span>
                        <span className="block">{member.name}</span>
                        <span className="text-xs text-zinc-400">{member.email || "Member account"}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-zinc-300">Member</td>
                  <td className="px-5 py-4 text-[#e7f27a] font-bold">{member.miles}</td>
                  <td className="px-5 py-4">0 days</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.length === 0 && <p className="p-6 text-sm text-zinc-400">Belum ada member yang mendaftar.</p>}
        </div>
      </div>
    </main>
  );
}
