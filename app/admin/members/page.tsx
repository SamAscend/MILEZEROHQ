"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminMember, listMembersFromSupabase } from "@/lib/supabase-data";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setMembers((await listMembersFromSupabase()) ?? []);
      } catch {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    void loadMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    const query = search.trim().toLowerCase();
    return !query || member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query);
  });

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

        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
          <div className="border-b border-white/10 p-4">
            <label htmlFor="member-search" className="sr-only">Search members</label>
            <input
              id="member-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-300 focus:border-[#e7f27a]/60"
            />
          </div>
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
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-t border-white/10">
                  <td className="px-5 py-4">
                    <Link href={`/profile/${member.id}`} className="flex items-center gap-3 font-semibold text-white">
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
          {loading && <p className="p-6 text-sm text-zinc-300">Loading members...</p>}
          {!loading && members.length === 0 && <p className="p-6 text-sm text-zinc-300">No members yet. New member accounts will appear here.</p>}
          {members.length > 0 && filteredMembers.length === 0 && <p className="p-6 text-sm text-zinc-300">No members match your search.</p>}
        </section>
      </div>
    </main>
  );
}
