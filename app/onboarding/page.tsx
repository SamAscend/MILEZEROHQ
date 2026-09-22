import Link from "next/link";

const avatarOptions = ["A", "B", "C", "D", "E", "F"];

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b0d] px-4 py-10 text-white">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Onboarding</p>
        <h1 className="mt-4 text-3xl font-black">Build your Runner Card</h1>

        <div className="mt-6 space-y-5">
          <div className="flex flex-col items-center gap-4 rounded-[28px] border border-white/10 bg-zinc-950/60 p-5 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#e7f27a] to-[#c8d65f] text-2xl font-black text-black">
              A
            </div>
            <div className="flex flex-wrap gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                      avatar === "A"
                      ? "border-[#e7f27a] bg-[#e7f27a] text-black"
                      : "border-white/10 bg-white/5 text-white"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Display name</label>
            <input placeholder="Your display name" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Username</label>
            <input placeholder="Choose a username" className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Short bio</label>
            <textarea placeholder="Tell the crew about yourself" className="h-28 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
          </div>

          <div className="rounded-[24px] border border-white/10 bg-zinc-950/60 p-4 text-sm leading-7 text-zinc-300">
            <p className="font-semibold text-white">Privacy notice</p>
            <p className="mt-2">
              Your profile data, including name, username, email account, and challenge history, may be visible to the admin team for moderation, monitoring, and safety purposes.
            </p>
          </div>

          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#e7f27a]" />
            I agree to the privacy notice and allow the admin team to access my profile and challenge history.
          </label>

          <Link href="/dashboard" className="block rounded-2xl bg-[#e7f27a] px-4 py-3 text-center font-bold text-black transition hover:bg-[#dfe96d]">
            Save profile
          </Link>
        </div>
      </div>
    </main>
  );
}
