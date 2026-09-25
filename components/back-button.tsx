"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className="fixed left-4 top-4 z-50 rounded-full border border-white/10 bg-[#121416]/90 px-4 py-2 text-sm font-semibold text-zinc-300 shadow-lg shadow-black/20 backdrop-blur transition hover:bg-white/10 hover:text-white"
    >
      <span aria-hidden="true">←</span> Back
    </button>
  );
}
