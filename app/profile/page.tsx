import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";

const stats = [
  { label: "Total Miles", value: "0" },
  { label: "Best Streak", value: "0 days" },
  { label: "Completion", value: "0%" },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 pb-28 pt-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Profile</p>
            <h1 className="mt-2 text-3xl font-black">Runner identity</h1>
          </div>
          <Link href="/notifications" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
            Notifications
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-700 text-xl font-black text-black">
                --
              </div>
              <div>
                <p className="text-2xl font-black">No profile yet</p>
                <p className="text-sm text-zinc-400">Complete onboarding to create your profile.</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-zinc-300">
              <p>Bio: Not set</p>
              <p>Email: Not available</p>
              <p>Tier: Starter</p>
              <p>Last login: No login recorded</p>
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">Overview</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-zinc-950/80 p-4">
                  <p className="text-sm text-zinc-400">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-[#e7f27a]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm text-zinc-300">
                  <span>Strength</span>
                  <span>0</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 w-0 rounded-full bg-[#e7f27a]" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm text-zinc-300">
                  <span>Endurance</span>
                  <span>0</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 w-0 rounded-full bg-[#e7f27a]" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm text-zinc-300">
                  <span>Recovery</span>
                  <span>0</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 w-0 rounded-full bg-[#e7f27a]" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
