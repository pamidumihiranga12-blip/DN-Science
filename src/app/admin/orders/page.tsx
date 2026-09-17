"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, ChevronDown, RefreshCw } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";

interface Order {
  id: number;
  quantity: number;
  totalPrice: string | null;
  status: string;
  shippingAddress: string | null;
  phone: string | null;
  notes: string | null;
  orderedAt: string;
  userId: number;
  bookId: number;
  userName: string | null;
  userEmail: string | null;
  bookTitle: string | null;
}

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
const statusColor: Record<string, string> = { pending: "badge-pending", confirmed: "badge-confirmed", shipped: "badge-shipped", delivered: "badge-active", cancelled: "badge-rejected" };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchOrders();
    setUpdating(null);
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const counts: Record<string, number> = { all: orders.length };
  statuses.forEach((s) => { counts[s] = orders.filter((o) => o.status === s).length; });

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-poppins">Book Orders</h1>
          <p className="text-slate-500 mt-1">Manage student book orders and delivery status</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["all", ...statuses].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filter === f ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-white text-slate-600 hover:bg-blue-50 border border-slate-200"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${filter === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
              {counts[f] || 0}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr><th>Student</th><th>Book</th><th>Qty</th><th>Total</th><th>Address</th><th>Date</th><th>Status</th><th>Update Status</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-400"><ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No orders found</p></td></tr>
                ) : (
                  filtered.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{o.userName}</p>
                          <p className="text-slate-400 text-xs">{o.phone}</p>
                        </div>
                      </td>
                      <td className="font-medium text-slate-800 text-sm max-w-36">
                        <p className="line-clamp-2">{o.bookTitle}</p>
                      </td>
                      <td className="text-slate-600 text-sm font-medium text-center">{o.quantity}</td>
                      <td className="font-bold text-slate-900 text-sm">{formatPrice(o.totalPrice || "0")}</td>
                      <td className="text-slate-500 text-xs max-w-36">
                        <p className="line-clamp-2">{o.shippingAddress || "—"}</p>
                      </td>
                      <td className="text-slate-500 text-xs">{formatDate(o.orderedAt)}</td>
                      <td>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor[o.status] || ""}`}>
                          {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="relative">
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o.id, e.target.value)}
                            disabled={updating === o.id}
                            className="appearance-none bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg pr-7 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer disabled:opacity-70"
                          >
                            {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-600 pointer-events-none" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
