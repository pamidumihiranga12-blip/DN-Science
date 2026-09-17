"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, PlayCircle, X, Save, ChevronDown } from "lucide-react";

interface Course { id: number; title: string; level: string; }
interface Video { id: number; courseId: number; title: string; description: string | null; youtubeUrl: string | null; duration: string | null; orderIndex: number; isFree: boolean; }

const emptyForm = { courseId: "", title: "", description: "", youtubeUrl: "", duration: "", orderIndex: 0, isFree: false };

export default function AdminVideosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCourses = useCallback(async () => {
    const res = await fetch("/api/courses?all=true");
    const data = await res.json();
    setCourses(data.courses || []);
  }, []);

  const fetchVideos = useCallback(async (courseId: number) => {
    const res = await fetch(`/api/courses/${courseId}`);
    const data = await res.json();
    setVideos(data.videos || []);
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { if (selectedCourse) fetchVideos(selectedCourse); }, [selectedCourse, fetchVideos]);

  const openAdd = () => {
    setForm({ ...emptyForm, courseId: selectedCourse?.toString() || "" });
    setEditing(null); setModal("add"); setError("");
  };

  const openEdit = (v: Video) => {
    setForm({ courseId: v.courseId.toString(), title: v.title, description: v.description || "", youtubeUrl: v.youtubeUrl || "", duration: v.duration || "", orderIndex: v.orderIndex, isFree: v.isFree });
    setEditing(v); setModal("edit"); setError("");
  };

  const handleSave = async () => {
    if (!form.courseId || !form.title) { setError("Course and title required"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch(editing ? `/api/videos/${editing.id}` : "/api/videos", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseId: parseInt(form.courseId) }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Failed"); return; }
      setModal(null);
      if (selectedCourse) fetchVideos(selectedCourse);
    } catch { setError("Something went wrong"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this video?")) return;
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    if (selectedCourse) fetchVideos(selectedCourse);
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-poppins">Videos</h1>
          <p className="text-slate-500 mt-1">Manage course video lessons</p>
        </div>
        <button onClick={openAdd} disabled={!selectedCourse} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30">
          <Plus className="w-5 h-5" />Add Video
        </button>
      </div>

      {/* Course selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Select Course to Manage Videos</label>
        <div className="relative max-w-sm">
          <select
            value={selectedCourse || ""}
            onChange={(e) => setSelectedCourse(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white appearance-none pr-10"
          >
            <option value="">-- Select a course --</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title} ({c.level})</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {!selectedCourse ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
          <PlayCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Select a course to view and manage its videos</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>YouTube</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-400">No videos for this course yet.</td></tr>
                ) : (
                  videos.map((v) => (
                    <tr key={v.id}>
                      <td className="text-slate-500 text-sm">{v.orderIndex + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <PlayCircle className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{v.title}</p>
                            {v.description && <p className="text-slate-400 text-xs line-clamp-1">{v.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="text-slate-600 text-sm">{v.duration || "—"}</td>
                      <td>
                        {v.youtubeUrl ? (
                          <a href={v.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">View Link</a>
                        ) : <span className="text-slate-400 text-sm">—</span>}
                      </td>
                      <td>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${v.isFree ? "badge-active" : "badge-pending"}`}>
                          {v.isFree ? "Free" : "Paid"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(v)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(v.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 font-poppins">{editing ? "Edit Video" : "Add Video"}</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Course *</label>
                <select value={form.courseId} onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                  <option value="">Select course</option>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Video Title *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Lesson title" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duration</label>
                  <input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. 45:00" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Order Index</label>
                  <input type="number" value={form.orderIndex} onChange={(e) => setForm((f) => ({ ...f, orderIndex: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">YouTube URL</label>
                <input value={form.youtubeUrl} onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="https://youtube.com/watch?v=..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isFree} onChange={(e) => setForm((f) => ({ ...f, isFree: e.target.checked }))} className="w-4 h-4 rounded accent-blue-600" />
                <span className="text-sm font-semibold text-slate-700">Free preview video (visible without enrollment)</span>
              </label>
            </div>
            <div className="flex items-center gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm font-medium">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
                <Save className="w-4 h-4" />{saving ? "Saving..." : "Save Video"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
