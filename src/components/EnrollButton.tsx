"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogIn } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function EnrollButton({
  courseId,
  price,
  isLoggedIn,
}: {
  courseId: number;
  price: string;
  isLoggedIn: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <a
          href="/login"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30"
        >
          <LogIn className="w-5 h-5" />
          Login to Enroll
        </a>
        <a
          href="/register"
          className="flex items-center justify-center w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold transition-all"
        >
          Create Free Account
        </a>
      </div>
    );
  }

  const handleEnroll = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to enroll");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4 px-6 bg-green-50 border border-green-200 rounded-xl">
        <p className="text-green-700 font-semibold">✓ Enrollment request submitted!</p>
        <p className="text-green-600 text-sm mt-1">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
          {error}
        </div>
      )}
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5"
      >
        <ShoppingCart className="w-5 h-5" />
        {loading ? "Processing..." : `Enroll for ${formatPrice(price)}`}
      </button>
      <p className="text-center text-slate-400 text-xs">
        Your request will be reviewed by admin. You'll gain access once approved.
      </p>
    </div>
  );
}
