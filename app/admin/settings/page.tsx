import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-black">Settings</h1>
          </div>
          <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Overview</Link>
        </header>

        <div className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Current password</label>
            <input type="password" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-zinc-300">New password</label>
            <input type="password" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Confirm password</label>
            <input type="password" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
          </div>

          <button className="rounded-2xl bg-[#e7f27a] px-4 py-3 font-bold text-black">Save changes</button>
        </div>
      </div>
    </main>
  );
}
