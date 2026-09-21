const leaderboard = [
  { name: "Aldo", miles: 456, tier: "Elite" },
  { name: "Raka", miles: 390, tier: "Pacer" },
  { name: "Nadia", miles: 371, tier: "Sprinter" },
  { name: "Bimo", miles: 330, tier: "Endurance" },
  { name: "Citra", miles: 315, tier: "Pacer" },
];

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Leaderboard</p>
          <h1 className="mt-2 text-3xl font-black">Weekly and monthly rankings</h1>
        </header>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-zinc-400">Weekly</p>
            <p className="mt-2 text-4xl font-black text-[#e7f27a]">#1 Aldo</p>
            <p className="mt-2 text-sm text-zinc-300">112 Miles this week</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-zinc-400">Monthly</p>
            <p className="mt-2 text-4xl font-black text-[#e7f27a]">#2 Raka</p>
            <p className="mt-2 text-sm text-zinc-300">390 total Miles</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-sm text-zinc-400">
              <tr>
                <th className="px-5 py-4">Rank</th>
                <th className="px-5 py-4">Member</th>
                <th className="px-5 py-4">Tier</th>
                <th className="px-5 py-4 text-right">Miles</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((member, index) => (
                <tr key={member.name} className="border-t border-white/10">
                  <td className="px-5 py-4 text-zinc-300">#{index + 1}</td>
                  <td className="px-5 py-4 font-semibold">{member.name}</td>
                  <td className="px-5 py-4 text-zinc-300">{member.tier}</td>
                  <td className="px-5 py-4 text-right font-bold text-[#e7f27a]">{member.miles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
