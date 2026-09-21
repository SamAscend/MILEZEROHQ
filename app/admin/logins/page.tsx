import Link from "next/link";

const loginEvents: { id: string; user: string; device: string; time: string }[] = [];

export default function AdminLoginsPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-black">Login logs</h1>
          </div>
          <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Overview</Link>
        </header>

        <div className="space-y-4">
          {loginEvents.map((event) => (
            <div key={event.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold">{event.user}</p>
                  <p className="text-sm text-zinc-400">{event.device}</p>
                </div>
                <span className="text-sm text-zinc-300">{event.time}</span>
              </div>
            </div>
          ))}
        </div>
        {loginEvents.length === 0 && <p className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-zinc-400">Belum ada login yang tercatat.</p>}
      </div>
    </main>
  );
}
