"use client";

import { useState, useEffect, useCallback } from "react";
import { PlayCircle, Plus, Trash2, ChevronDown, Users, Video } from "lucide-react";

interface User { id: number; name: string; email: string; grade: string | null; }
interface Course { id: number; title: string; level: string; }
interface VideoItem { id: number; courseId: number; title: string; isFree: boolean; orderIndex: number; duration: string | null; }
interface StudentVideo { id: number; title: string; isFree: boolean; duration: string | null; }

export default function AdminVideoAccessPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [courseVideos, setCourseVideos] = useState<VideoItem[]>([]);
  const [studentVideos, setStudentVideos] = useState<StudentVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then((d) => setUsers(d.users?.filter((u: User & { role: string }) => u.role === "student") || []));
    fetch("/api/courses?all=true").then((r) => r.json()).then((d) => setCourses(d.courses || []));
  }, []);

  const fetchStudentVideos = useCallback(async (userId: number) => {
    setLoading(true);
    const res = await fetch(`/api/student-videos?userId=${userId}`);
    const data = await res.json();
    setStudentVideos(data.videos || []);
    setLoading(false);
  }, []);

  const fetchCourseVideos = useCallback(async (courseId: number) => {
    const res = await fetch(`/api/courses/${courseId}`);
    const data = await res.json();
    setCourseVideos(data.videos || []);
  }, []);

  useEffect(() => {
    if (selectedUser) fetchStudentVideos(selectedUser);
  }, [selectedUser, fetchStudentVideos]);

  useEffect(() => {
    if (selectedCourse) fetchCourseVideos(selectedCourse);
    else setCourseVideos([]);
  }, [selectedCourse, fetchCourseVideos]);

  const grantAccess = async (videoId: number) => {
    if (!selectedUser) return;
    setActionLoading(videoId);
    await fetch("/api/student-videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser, videoId, action: "grant" }),
    });
    await fetchStudentVideos(selectedUser);
    setActionLoading(null);
  };

  const revokeAccess = async (videoId: number) => {
    if (!selectedUser) return;
    setActionLoading(videoId);
    await fetch("/api/student-videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser, videoId, action: "revoke" }),
    });
    await fetchStudentVideos(selectedUser);
    setActionLoading(null);
  };

  const studentVideoIds = new Set(studentVideos.map((v) => v.id));
  const selectedUserData = users.find((u) => u.id === selectedUser);

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-poppins">Video Access Management</h1>
        <p className="text-slate-500 mt-1">Manually grant or revoke individual video access per student</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Student + Course selectors */}
        <div className="space-y-6">
          {/* Student selector */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />Select Student
            </h2>
            <div className="relative">
              <select
                value={selectedUser || ""}
                onChange={(e) => { setSelectedUser(e.target.value ? parseInt(e.target.value) : null); setSelectedCourse(null); setCourseVideos([]); }}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white appearance-none pr-10"
              >
                <option value="">-- Select a student --</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Course selector */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-600" />Browse Course Videos
            </h2>
            <div className="relative mb-4">
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

            {courseVideos.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {courseVideos.map((v) => {
                  const hasAccess = studentVideoIds.has(v.id);
                  return (
                    <div key={v.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${hasAccess ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <PlayCircle className={`w-4 h-4 shrink-0 ${hasAccess ? "text-green-600" : "text-slate-400"}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{v.title}</p>
                          {v.duration && <p className="text-xs text-slate-400">{v.duration}</p>}
                        </div>
                      </div>
                      <div className="shrink-0 ml-3">
                        {!selectedUser ? (
                          <span className="text-xs text-slate-400">Select student first</span>
                        ) : hasAccess ? (
                          <button onClick={() => revokeAccess(v.id)} disabled={actionLoading === v.id}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors">
                            <Trash2 className="w-3 h-3" />Revoke
                          </button>
                        ) : (
                          <button onClick={() => grantAccess(v.id)} disabled={actionLoading === v.id}
                            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors">
                            <Plus className="w-3 h-3" />Grant
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedCourse && courseVideos.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-6">No videos in this course yet.</p>
            )}
          </div>
        </div>

        {/* Right: Student's current videos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-green-600" />
            {selectedUserData ? `${selectedUserData.name}'s Accessible Videos` : "Student's Videos"}
          </h2>
          {selectedUser && <p className="text-slate-400 text-xs mb-4">Videos accessible via enrollment + manual grants</p>}

          {!selectedUser ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Users className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Select a student to view their video access</p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : studentVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <PlayCircle className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No videos accessible yet</p>
              <p className="text-xs mt-1">Grant access using the panel on the left</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <p className="text-xs text-slate-500 mb-3 font-medium">{studentVideos.length} video{studentVideos.length !== 1 ? "s" : ""} accessible</p>
              {studentVideos.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <PlayCircle className="w-4 h-4 text-green-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{v.title}</p>
                      {v.duration && <p className="text-xs text-slate-400">{v.duration}</p>}
                    </div>
                  </div>
                  <button onClick={() => revokeAccess(v.id)} disabled={actionLoading === v.id}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold transition-colors shrink-0 ml-2 hover:bg-red-50 px-2 py-1 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
