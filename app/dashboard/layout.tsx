import { BottomNav } from "@/components/bottom-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      {children}
      <BottomNav />
    </div>
  );
}
