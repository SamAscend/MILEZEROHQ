import { BottomNav } from "@/components/bottom-nav";
import { BackButton } from "@/components/back-button";

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <BackButton />
      {children}
      <BottomNav />
    </div>
  );
}
