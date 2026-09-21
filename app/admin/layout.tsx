import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/challenges", label: "Challenges" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/logins", label: "Logins" },
  { href: "/admin/logs", label: "Audit" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0d]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-black tracking-[0.28em] text-white">
            MILEZERO
          </Link>
          <div className="hidden flex-wrap items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link href="/login" className="rounded-full bg-[#e7f27a] px-4 py-2 text-sm font-bold text-black">
            Member view
          </Link>
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}
