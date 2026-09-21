const data: { week: string; miles: number }[] = [];

export default function StatsPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Stats</p>
          <h1 className="mt-2 text-3xl font-black">Performance overview</h1>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-zinc-400">Total challenge</p>
            <p className="mt-2 text-3xl font-black text-[#e7f27a]">0</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-zinc-400">Completion rate</p>
            <p className="mt-2 text-3xl font-black text-[#e7f27a]">0%</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-zinc-400">Current streak</p>
            <p className="mt-2 text-3xl font-black text-[#e7f27a]">0 days</p>
          </div>
        </div>

        <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="mb-6 text-xl font-bold">Miles per week</h2>
          <div className="flex h-52 items-end gap-3">
            {data.map((item) => (
              <div key={item.week} className="flex flex-1 flex-col items-center gap-3">
                <div className="w-full rounded-t-2xl bg-[#e7f27a]" style={{ height: `${(item.miles / 60) * 100}%` }} />
                <span className="text-xs text-zinc-400">{item.week}</span>
              </div>
            ))}
          </div>
          {data.length === 0 && <p className="text-sm text-zinc-400">Belum ada data aktivitas.</p>}
        </section>
      </div>
    </main>
  );
}
