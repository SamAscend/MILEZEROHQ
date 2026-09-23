const notifications: { type: string; message: string; time: string }[] = [];

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Notifications</p>
          <h1 className="mt-2 text-3xl font-black">Latest updates</h1>
        </header>

        {notifications.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-8 text-center">
            <p className="font-semibold text-zinc-200">No notifications yet</p>
            <p className="mt-2 text-sm text-zinc-400">Updates about challenges, approvals, and activity will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div key={item.message} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#e7f27a]/10 px-2 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#e7f27a]">{item.type}</span>
                  <span className="text-xs text-zinc-400">{item.time}</span>
                </div>
                <p className="mt-4 text-base text-zinc-200">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
