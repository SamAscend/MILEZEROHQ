import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b0d] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin Portal</p>
        <h1 className="mt-4 text-3xl font-black">Secure login</h1>

        <form className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Username</label>
            <input
              defaultValue="admin.milezero"
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Password</label>
            <input
              type="password"
              defaultValue="admin123"
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"
            />
          </div>

          <Link href="/admin" className="block rounded-2xl bg-[#e7f27a] px-4 py-3 text-center font-bold text-black">
            Sign in
          </Link>

          <Link href="/login" className="block text-center text-sm text-zinc-400 underline">
            Back to member login
          </Link>
        </form>
      </div>
    </main>
  );
}
