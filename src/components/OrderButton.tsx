"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogIn, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function OrderButton({
  bookId,
  price,
  isLoggedIn,
  inStock,
}: {
  bookId: number;
  price: string;
  isLoggedIn: boolean;
  inStock: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const router = useRouter();

  if (!inStock) {
    return (
      <div className="text-center py-4 px-6 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-600 font-semibold">Out of Stock</p>
        <p className="text-red-500 text-sm mt-1">Contact us to be notified when available</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <a href="/login" className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg">
          <LogIn className="w-5 h-5" />Login to Order
        </a>
        <a href="/register" className="flex items-center justify-center w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 rounded-xl font-semibold transition-all">
          Create Free Account
        </a>
      </div>
    );
  }

  const handleOrder = async () => {
    if (!address || !phone) { setError("Address and phone are required"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, quantity: qty, shippingAddress: address, phone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to place order"); }
      else { setSuccess(true); setTimeout(() => router.push("/dashboard"), 1500); }
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="text-center py-4 px-6 bg-green-50 border border-green-200 rounded-xl">
        <p className="text-green-700 font-semibold">✓ Order placed successfully!</p>
        <p className="text-green-600 text-sm mt-1">Redirecting to dashboard...</p>
      </div>
    );
  }

  if (!showForm) {
    return (
      <button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:-translate-y-0.5">
        <ShoppingCart className="w-5 h-5" />
        Order Now — {formatPrice(price)}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      <div>
        <label className="text-xs font-semibold text-slate-600 mb-1 block">Quantity</label>
        <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 mb-1 block">Phone Number *</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 77 XXX XXXX" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 mb-1 block">Delivery Address *</label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your full address..." rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" />
      </div>

      <div className="bg-indigo-50 rounded-xl p-3 text-sm">
        <div className="flex justify-between text-slate-700">
          <span>Total ({qty} × {formatPrice(price)})</span>
          <span className="font-bold text-indigo-700">{formatPrice(parseFloat(price) * qty)}</span>
        </div>
      </div>

      <button onClick={handleOrder} disabled={loading} className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white py-3 rounded-xl font-semibold transition-all">
        <Package className="w-5 h-5" />
        {loading ? "Processing..." : "Confirm Order"}
      </button>
      <button onClick={() => setShowForm(false)} className="w-full text-slate-500 text-sm hover:text-slate-700 py-2">Cancel</button>
    </div>
  );
}
