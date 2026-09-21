import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/challenges", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full border border-white/10 bg-[#121416]/90 p-2 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full px-2 py-3 text-center text-xs font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
