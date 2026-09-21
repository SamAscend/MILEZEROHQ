const tabs = ["Daily", "Weekly", "Monthly", "Special"] as const;

const challengeData = {
  Daily: [
    { title: "Push-up 30 reps", category: "Gym", reward: "10 Miles", proof: false },
    { title: "5K easy run", category: "Lari", reward: "18 Miles", proof: true },
    { title: "Recovery walk", category: "Recovery", reward: "6 Miles", proof: false },
  ],
  Weekly: [
    { title: "Total 25 km", category: "Lari", reward: "30 Miles", proof: true },
    { title: "3 swim sessions", category: "Renang", reward: "22 Miles", proof: true },
  ],
  Monthly: [
    { title: "Total 120 km", category: "Endurance", reward: "50 Miles", proof: true },
    { title: "6 gym sessions", category: "Gym", reward: "25 Miles", proof: false },
  ],
  Special: [
    { title: "Crew sprint race", category: "Event", reward: "40 Miles", proof: true },
    { title: "Night recovery ritual", category: "Recovery", reward: "15 Miles", proof: false },
  ],
};

export default function ChallengesPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Challenges</p>
            <h1 className="mt-2 text-3xl font-black">Claim your mission</h1>
          </div>
          <button className="rounded-full bg-[#e7f27a] px-4 py-2 text-sm font-bold text-black">+ New challenge</button>
        </header>

        <div className="mb-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                tab === "Daily"
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-zinc-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {challengeData.Daily.map((challenge) => (
            <div key={challenge.title} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-zinc-900 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
                  {challenge.category}
                </span>
                <span className="text-xs text-[#e7f27a]">{challenge.reward}</span>
              </div>
              <h2 className="text-xl font-bold">{challenge.title}</h2>
              <p className="mt-3 text-sm text-zinc-400">
                {challenge.proof ? "Requires proof upload for approval." : "No proof required for this challenge."}
              </p>
              <div className="mt-6 flex gap-3">
                <button className="flex-1 rounded-2xl bg-white px-4 py-2 font-semibold text-black">Complete</button>
                {challenge.proof && <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm">Upload</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
