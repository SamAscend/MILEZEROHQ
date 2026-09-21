const notifications = [
  { type: "Challenge", message: "New daily challenge is live: 5K easy run", time: "2m ago" },
  { type: "Approval", message: "Your proof for Push-up 30 reps was approved", time: "1h ago" },
  { type: "Tier", message: "You reached Pacer tier and unlocked new badge", time: "Yesterday" },
];

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Notifications</p>
          <h1 className="mt-2 text-3xl font-black">Latest updates</h1>
        </header>

        <div className="space-y-4">
          {notifications.map((item) => (
            <div key={item.message} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#e7f27a]/10 px-2 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#e7f27a]">
                  {item.type}
                </span>
                <span className="text-xs text-zinc-400">{item.time}</span>
              </div>
              <p className="mt-4 text-base text-zinc-200">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
