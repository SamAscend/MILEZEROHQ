import Link from "next/link";

export default function AdminMemberDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Member detail</p>
            <h1 className="mt-2 text-3xl font-black">Member not found</h1>
          </div>
          <Link href="/admin/members" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Back</Link>
        </header>

        <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-8 text-sm text-zinc-400">
          Member belum terdaftar atau data member belum tersedia.
        </div>
      </div>
    </main>
  );
}
