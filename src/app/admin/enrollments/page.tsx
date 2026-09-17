"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, ClipboardList, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Enrollment {
  id: number;
  status: string;
  enrolledAt: string;
  approvedAt: string | null;
  notes: string | null;
  userId: number;
  courseId: number;
  userName: string | null;
  userEmail: string | null;
  courseTitle: string | null;
  coursePrice: string | null;
}

const statusColor: Record<string, string> = { pending: "badge-pending", active: "badge-active", rejected: "badge-rejected" };

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "rejected">("all");
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/enrollments");
    const data = await res.json();
    setEnrollments(data.enrollments || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  const updateStatus = async (id: number, status: "active" | "rejected") => {
    setUpdating(id);
    await fetch(`/api/enrollments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchEnrollments();
    setUpdating(null);
  };

  const filtered = filter === "all" ? enrollments : enrollments.filter((e) => e.status === filter);
  const counts = { all: enrollments.length, pending: enrollments.filter((e) => e.status === "pending").length, active: enrollments.filter((e) => e.status === "active").length, rejected: enrollments.filter((e) => e.status === "rejected").length };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-poppins">Enrollments</h1>
          <p className="text-slate-500 mt-1">Review and manage student enrollment requests</p>
        </div>
        <button onClick={fetchEnrollments} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(["all", "pending", "active", "rejected"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filter === f ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-white text-slate-600 hover:bg-blue-50 border border-slate-200"}`}>
            {f === "pending" && <Clock className="w-4 h-4" />}
            {f === "active" && <CheckCircle className="w-4 h-4" />}
            {f === "rejected" && <XCircle className="w-4 h-4" />}
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${filter === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
              {counts[f]}
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
                <tr><th>Student</th><th>Course</th><th>Price</th><th>Date</th><th>Notes</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400"><ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No enrollments found</p></td></tr>
                ) : (
                  filtered.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{e.userName}</p>
                          <p className="text-slate-400 text-xs">{e.userEmail}</p>
                        </div>
                      </td>
                      <td className="font-medium text-slate-800 text-sm max-w-48">
                        <p className="line-clamp-2">{e.courseTitle}</p>
                      </td>
                      <td className="font-semibold text-slate-900 text-sm">
                        Rs. {parseFloat(e.coursePrice || "0").toLocaleString()}
                      </td>
                      <td className="text-slate-500 text-xs">{formatDate(e.enrolledAt)}</td>
                      <td className="text-slate-500 text-xs max-w-36">
                        <p className="line-clamp-2">{e.notes || "—"}</p>
                      </td>
                      <td>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor[e.status] || ""}`}>
                          {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        {e.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateStatus(e.id, "active")} disabled={updating === e.id}
                              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors">
                              <CheckCircle className="w-3.5 h-3.5" />Approve
                            </button>
                            <button onClick={() => updateStatus(e.id, "rejected")} disabled={updating === e.id}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors">
                              <XCircle className="w-3.5 h-3.5" />Reject
                            </button>
                          </div>
                        )}
                        {e.status === "active" && (
                          <button onClick={() => updateStatus(e.id, "rejected")} disabled={updating === e.id}
                            className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors">
                            <XCircle className="w-3.5 h-3.5" />Revoke
                          </button>
                        )}
                        {e.status === "rejected" && (
                          <button onClick={() => updateStatus(e.id, "active")} disabled={updating === e.id}
                            className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-600 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors">
                            <CheckCircle className="w-3.5 h-3.5" />Approve
                          </button>
                        )}
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
