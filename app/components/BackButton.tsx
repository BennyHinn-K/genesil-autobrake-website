"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-yellow-600 border border-yellow-500 ${className}`}
      aria-label="Go back"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <ArrowLeft className="h-5 w-5" />
      <span>Back</span>
    </button>
  );
} 