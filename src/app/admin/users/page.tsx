"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Edit, Trash2, X, Save, Shield, ShieldOff, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface User { id: number; name: string; email: string; phone: string | null; school: string | null; grade: string | null; role: string; status: string; createdAt: string; }

const statusColor: Record<string, string> = { active: "badge-active", suspended: "badge-rejected", pending: "badge-pending" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"edit" | "add" | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", school: "", grade: "", role: "student", status: "active" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.school || "").toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (u: User) => {
    setForm({ name: u.name, email: u.email, password: "", phone: u.phone || "", school: u.school || "", grade: u.grade || "", role: u.role, status: u.status });
    setEditing(u); setModal("edit"); setError("");
  };

  const openAdd = () => {
    setForm({ name: "", email: "", password: "", phone: "", school: "", grade: "", role: "student", status: "active" });
    setEditing(null); setModal("add"); setError("");
  };

  const handleSave = async () => {
    if (!form.name || !form.email) { setError("Name and email required"); return; }
    if (!editing && !form.password) { setError("Password required for new user"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch(editing ? `/api/users/${editing.id}` : "/api/users", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
      setModal(null); fetchUsers();
    } catch { setError("Something went wrong"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this student permanently?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const toggleStatus = async (u: User) => {
    const newStatus = u.status === "active" ? "suspended" : "active";
    await fetch(`/api/users/${u.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    fetchUsers();
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-poppins">Students</h1>
          <p className="text-slate-500 mt-1">Manage registered students ({users.filter(u => u.role === "student").length} total)</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30">
          <Plus className="w-5 h-5" />Add User
        </button>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by name, email, school..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr><th>Student</th><th>School</th><th>Grade</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400"><Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No users found</p></td></tr>
                ) : filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{u.name}</p>
                          <p className="text-slate-400 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-600 text-sm">{u.school || "—"}</td>
                    <td className="text-slate-600 text-sm">{u.grade || "—"}</td>
                    <td><span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${u.role === "admin" ? "badge-confirmed" : "bg-slate-50 text-slate-600 border-slate-200"}`}>{u.role}</span></td>
                    <td><span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor[u.status] || ""}`}>{u.status}</span></td>
                    <td className="text-slate-500 text-xs">{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(u)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => toggleStatus(u)} className={`p-2 rounded-lg ${u.status === "active" ? "text-orange-500 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}`} title={u.status === "active" ? "Suspend" : "Activate"}>
                          {u.status === "active" ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-3xl">
              <h2 className="text-xl font-bold text-slate-900">{editing ? "Edit User" : "Add User"}</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{editing ? "New Password (leave blank to keep)" : "Password *"}</label>
                  <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Grade</label>
                  <input value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">School</label>
                  <input value={form.school} onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                  <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    <option value="student">Student</option><option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    <option value="active">Active</option><option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-6 border-t border-slate-100 sticky bottom-0 bg-white rounded-b-3xl">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
                <Save className="w-4 h-4" />{saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
