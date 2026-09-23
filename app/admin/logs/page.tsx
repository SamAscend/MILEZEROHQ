import Link from "next/link";

const auditLogs: { id: string; admin: string; action: string; time: string }[] = [];

export default function AdminLogsPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-black">Audit log</h1>
          </div>
          <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Overview</Link>
        </header>

        <div className="space-y-4">
          {auditLogs.map((log) => (
            <div key={log.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">{log.admin}</p>
              <p className="mt-2 text-sm text-zinc-300">{log.action}</p>
              <p className="mt-2 text-xs text-zinc-500">{log.time}</p>
            </div>
          ))}
        </div>
        {auditLogs.length === 0 && <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-8 text-center"><p className="font-semibold text-zinc-200">No audit activity yet</p><p className="mt-2 text-sm text-zinc-400">Admin changes and moderation actions will appear here.</p></div>}
      </div>
    </main>
  );
}
