"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg mb-4"
    >
      ← Back
    </button>
  );
}