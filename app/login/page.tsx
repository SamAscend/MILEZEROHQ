import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-lg font-black tracking-[0.28em] text-white">
            MILEZERO
          </Link>
          <Link href="/admin/login" className="text-sm text-zinc-300 transition hover:text-white">
            Admin Portal
          </Link>
        </div>

        <div className="grid overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 md:grid-cols-2">
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 md:p-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
              Member access
            </p>
            <h1 className="text-4xl font-black tracking-tight">Run with your crew.</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-300">
              Sign in with Google to claim your challenge, track your Miles, and grow your Runner Card.
            </p>

            <div className="mt-8 space-y-3 text-sm text-zinc-200">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold">1</span>
                Setup your profile
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold">2</span>
                Complete daily and weekly missions
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold">3</span>
                Accumulate Miles and rise through tiers
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-sm">
              <button className="rounded-full bg-white px-4 py-2 font-semibold text-black">Google</button>
              <button className="px-4 py-2 text-zinc-300">Username</button>
            </div>

            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">Google account</label>
                <button type="button" className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200">
                  <span className="text-lg">G</span>
                  Continue with Google
                </button>
              </div>

              <div className="text-center text-xs uppercase tracking-[0.25em] text-zinc-500">or</div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">Username</label>
                <input
                  defaultValue="raka.runner"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none ring-0 placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">Password</label>
                <input
                  type="password"
                  defaultValue="password123"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none ring-0 placeholder:text-zinc-500"
                />
              </div>

              <Link href="/dashboard" className="block rounded-2xl bg-[#e7f27a] px-4 py-3 text-center font-bold text-black transition hover:bg-[#d9e35b]">
                Sign in
              </Link>

              <p className="text-center text-xs text-zinc-400">
                New here? <a href="#" className="text-white underline">Create account</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
