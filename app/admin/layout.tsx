"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  const pathname = usePathname();
  const router = useRouter();

  const handleAdminLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0d]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-black tracking-[0.28em] text-white">
            MILEZERO
          </Link>
          <nav aria-label="Admin navigation" className="hidden flex-wrap items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`)) ? "page" : undefined}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`))
                    ? "border-[#e7f27a]/50 bg-[#e7f27a]/15 text-[#f1f7a2]"
                    : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden h-8 w-px bg-white/20 md:block" aria-hidden="true" />
          <button type="button" onClick={handleAdminLogout} className="rounded-full bg-[#e7f27a] px-4 py-2 text-sm font-bold text-black transition hover:bg-[#dfe96d]">
            Log out
          </button>
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}
