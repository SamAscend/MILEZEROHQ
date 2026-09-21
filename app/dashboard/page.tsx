import Link from "next/link";

const statCards = [
  { label: "Miles", value: "0", trend: "No activity yet" },
  { label: "Streak", value: "0 days", trend: "No activity yet" },
  { label: "Completion", value: "0%", trend: "No challenges completed" },
  { label: "Tier", value: "Starter", trend: "Begin your first challenge" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">MileZero</p>
            <h1 className="mt-2 text-3xl font-black">Crew Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Notifications</button>
            <Link href="/" className="rounded-full bg-[#e7f27a] px-4 py-2 text-sm font-bold text-black">Home</Link>
          </div>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-zinc-400">{card.label}</p>
              <div className="mt-3 text-3xl font-black">{card.value}</div>
              <p className="mt-2 text-xs text-emerald-300">{card.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Runner Card</h2>
              <span className="rounded-full border border-[#e7f27a] bg-[#e7f27a]/10 px-3 py-1 text-xs font-semibold text-[#e7f27a]">
                Mile 12
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-zinc-300 to-zinc-700 text-xl font-black text-black">
                --
              </div>
              <div>
                <p className="text-2xl font-black">No profile yet</p>
                <p className="text-sm text-zinc-400">Complete onboarding to create your Runner Card.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-zinc-400">Progress to Sprinter</span>
                  <span className="text-[#e7f27a]">0%</span>
                </div>
                <div className="h-2.5 rounded-full bg-zinc-800">
                  <div className="h-2.5 w-0 rounded-full bg-[#e7f27a]" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["STR", "0"],
                  ["AGI", "0"],
                  ["VIT", "0"],
                  ["INT", "0"],
                ].map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>{key}</span>
                      <span>{value}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-800">
                      <div className="h-2 rounded-full bg-white" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">Badges</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              <p className="text-sm text-zinc-400">Badges will appear after completing challenges.</p>
            </div>

            <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#e7f27a] to-[#cfe35a] p-4 text-black">
              <p className="text-xs font-bold uppercase tracking-[0.25em]">Next milestone</p>
              <p className="mt-3 text-2xl font-black">Complete your first challenge</p>
              <p className="mt-2 text-sm">Your next milestone will appear here.</p>
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Today&apos;s challenges</h2>
            <Link href="/challenges" className="text-sm text-[#e7f27a]">Open all</Link>
          </div>

          <div className="rounded-3xl border border-dashed border-white/10 bg-zinc-950/80 p-6 text-sm text-zinc-400">
            No challenges completed yet. Browse available challenges to get started.
          </div>
        </section>
      </div>
    </main>
  );
}
