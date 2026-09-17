"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen, X, Save } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Course {
  id: number;
  title: string;
  description: string | null;
  level: string;
  subject: string | null;
  price: string;
  thumbnail: string | null;
  isPublished: boolean;
  totalVideos: number;
}

const empty = { title: "", description: "", level: "OL", subject: "", price: "", thumbnail: "", isPublished: true };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCourses = useCallback(async () => {
    const res = await fetch("/api/courses?all=true");
    const data = await res.json();
    setCourses(data.courses || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const openAdd = () => { setForm(empty); setEditing(null); setModal("add"); setError(""); };
  const openEdit = (c: Course) => {
    setForm({ title: c.title, description: c.description || "", level: c.level, subject: c.subject || "", price: c.price, thumbnail: c.thumbnail || "", isPublished: c.isPublished });
    setEditing(c); setModal("edit"); setError("");
  };

  const handleSave = async () => {
    if (!form.title) { setError("Title is required"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch(editing ? `/api/courses/${editing.id}` : "/api/courses", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: form.price || "0" }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
      setModal(null);
      fetchCourses();
    } catch { setError("Something went wrong"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    await fetch(`/api/courses/${id}`, { method: "DELETE" });
    fetchCourses();
  };

  const handleToggle = async (c: Course) => {
    await fetch(`/api/courses/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !c.isPublished }),
    });
    fetchCourses();
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-poppins">Courses</h1>
          <p className="text-slate-500 mt-1">Manage your science courses</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30">
          <Plus className="w-5 h-5" />Add Course
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Level</th>
                  <th>Subject</th>
                  <th>Price</th>
                  <th>Videos</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400">No courses yet. Add your first course!</td></tr>
                ) : courses.map((c) => (
                  <tr key={c.id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900 text-sm max-w-xs">{c.title}</span>
                      </div>
                    </td>
                    <td><span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">{c.level}</span></td>
                    <td className="text-slate-600 text-sm">{c.subject || "—"}</td>
                    <td className="font-semibold text-slate-900">{formatPrice(c.price)}</td>
                    <td className="text-slate-600">{c.totalVideos}</td>
                    <td>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${c.isPublished ? "badge-active" : "badge-pending"}`}>
                        {c.isPublished ? "Published" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleToggle(c)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors" title={c.isPublished ? "Hide" : "Show"}>
                          {c.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 font-poppins">{editing ? "Edit Course" : "Add New Course"}</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Course title" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Level</label>
                  <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    <option value="OL">O/L</option>
                    <option value="AL">A/L</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Price (LKR)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Physics, Chemistry" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" placeholder="Course description..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Thumbnail URL</label>
                <input value={form.thumbnail} onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="https://..." />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
                <span className="text-sm font-semibold text-slate-700">Published (visible to students)</span>
              </label>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-4 py-2.5 rounded-xl transition-all text-sm font-semibold">
                <Save className="w-4 h-4" />{saving ? "Saving..." : "Save Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
