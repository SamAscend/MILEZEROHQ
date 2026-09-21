const summary = [
  { label: "Active members", value: "86" },
  { label: "Challenge completions", value: "214" },
  { label: "Pending proof", value: "7" },
  { label: "Avg. streak", value: "5.2d" },
];

const memberRows = [
  { name: "Raka Kurnia", mile: "184", tier: "Pacer", status: "Active" },
  { name: "Nadia Sari", mile: "210", tier: "Sprinter", status: "Active" },
  { name: "Edo Arif", mile: "152", tier: "Starter", status: "Inactive" },
];

const proofQueue = [
  { member: "Bimo", challenge: "5K easy run", status: "Pending" },
  { member: "Citra", challenge: "Push-up 30 reps", status: "Pending" },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-black">Crew operations</h1>
          </div>
          <button className="rounded-full bg-[#e7f27a] px-4 py-2 text-sm font-bold text-black">Create challenge</button>
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
                    <tr key={member.name} className="border-t border-white/10">
                      <td className="px-4 py-3">{member.name}</td>
                      <td className="px-4 py-3">{member.mile}</td>
                      <td className="px-4 py-3">{member.tier}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs ${member.status === "Active" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-bold">Proof review queue</h2>
            <div className="space-y-3">
              {proofQueue.map((item) => (
                <div key={item.member} className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.member}</p>
                      <p className="text-sm text-zinc-400">{item.challenge}</p>
                    </div>
                    <span className="rounded-full bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-300">
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-xl bg-[#e7f27a] px-3 py-2 text-sm font-bold text-black">Approve</button>
                    <button className="rounded-xl border border-white/10 px-3 py-2 text-sm">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
