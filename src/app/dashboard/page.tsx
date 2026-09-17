import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { enrollments, bookOrders, courses, books, studentVideoAccess, videos } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import { BookOpen, PlayCircle, ShoppingCart, User, GraduationCap, Clock, CheckCircle, XCircle, Package } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "admin") redirect("/admin");

  const [userEnrollments, userOrders] = await Promise.all([
    db.select({
      id: enrollments.id,
      status: enrollments.status,
      enrolledAt: enrollments.enrolledAt,
      approvedAt: enrollments.approvedAt,
      courseId: enrollments.courseId,
      courseTitle: courses.title,
      coursePrice: courses.price,
      courseLevel: courses.level,
      courseThumbnail: courses.thumbnail,
    })
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, session.userId))
      .orderBy(enrollments.enrolledAt),
    db.select({
      id: bookOrders.id,
      status: bookOrders.status,
      totalPrice: bookOrders.totalPrice,
      quantity: bookOrders.quantity,
      orderedAt: bookOrders.orderedAt,
      bookId: bookOrders.bookId,
      bookTitle: books.title,
    })
      .from(bookOrders)
      .leftJoin(books, eq(bookOrders.bookId, books.id))
      .where(eq(bookOrders.userId, session.userId))
      .orderBy(bookOrders.orderedAt),
  ]);

  // Get videos for active enrollments
  const activeEnrollments = userEnrollments.filter((e) => e.status === "active");
  const enrolledCourseIds = activeEnrollments.map((e) => e.courseId!).filter(Boolean);

  let accessibleVideos: typeof videos.$inferSelect[] = [];
  if (enrolledCourseIds.length > 0) {
    accessibleVideos = await db.select().from(videos).where(inArray(videos.courseId, enrolledCourseIds));
  }

  // Manual video access
  const manualAccess = await db.select({ videoId: studentVideoAccess.videoId }).from(studentVideoAccess).where(eq(studentVideoAccess.userId, session.userId));
  const manualVideoIds = manualAccess.map((a) => a.videoId);
  let manualVideos: typeof videos.$inferSelect[] = [];
  if (manualVideoIds.length > 0) {
    manualVideos = await db.select().from(videos).where(inArray(videos.id, manualVideoIds));
  }
  const allVideos = [...accessibleVideos, ...manualVideos].filter((v, i, arr) => arr.findIndex((vv) => vv.id === v.id) === i);

  const stats = [
    { label: "Enrolled Courses", value: userEnrollments.length, icon: <GraduationCap className="w-6 h-6" />, color: "bg-blue-100 text-blue-700" },
    { label: "Active Courses", value: activeEnrollments.length, icon: <CheckCircle className="w-6 h-6" />, color: "bg-green-100 text-green-700" },
    { label: "Videos Available", value: allVideos.length, icon: <PlayCircle className="w-6 h-6" />, color: "bg-indigo-100 text-indigo-700" },
    { label: "Book Orders", value: userOrders.length, icon: <Package className="w-6 h-6" />, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <main>
      <Navbar />

      <section className="hero-gradient pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-poppins">Welcome, {session.name}!</h1>
              <p className="text-blue-200">Student Dashboard — Track your learning journey</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shrink-0`}>{stat.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-slate-500 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* My Courses */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" />My Courses</h2>
                <Link href="/courses" className="text-blue-600 text-sm font-medium hover:text-blue-800">Browse More →</Link>
              </div>
              <div className="divide-y divide-slate-50">
                {userEnrollments.length === 0 ? (
                  <div className="p-8 text-center">
                    <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No courses enrolled yet</p>
                    <Link href="/courses" className="text-blue-600 text-sm font-medium mt-2 inline-block">Browse Courses →</Link>
                  </div>
                ) : (
                  userEnrollments.map((e) => (
                    <div key={e.id} className="p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shrink-0">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{e.courseTitle}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{e.courseLevel} · {formatDate(e.enrolledAt)}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(e.status)}`}>
                          {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                        </span>
                      </div>
                      {e.status === "pending" && (
                        <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" />Waiting for admin approval</p>
                      )}
                      {e.status === "rejected" && (
                        <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><XCircle className="w-3 h-3" />Enrollment was rejected. Contact admin.</p>
                      )}
                      {e.status === "active" && (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Access granted! Videos available below.</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* My Book Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-indigo-600" />My Book Orders</h2>
                <Link href="/books" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">Browse Books →</Link>
              </div>
              <div className="divide-y divide-slate-50">
                {userOrders.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No orders yet</p>
                    <Link href="/books" className="text-indigo-600 text-sm font-medium mt-2 inline-block">Browse Books →</Link>
                  </div>
                ) : (
                  userOrders.map((o) => (
                    <div key={o.id} className="p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shrink-0">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{o.bookTitle}</p>
                            <p className="text-slate-400 text-xs mt-0.5">Qty: {o.quantity} · {formatPrice(o.totalPrice || "0")}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(o.status)}`}>
                          {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* My Videos */}
          {allVideos.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-green-600" />
                  My Video Lessons
                  <span className="ml-2 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">{allVideos.length} videos</span>
                </h2>
              </div>
              <div className="divide-y divide-slate-50">
                {allVideos.map((video) => (
                  <div key={video.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                      <PlayCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{video.title}</p>
                      {video.description && <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{video.description}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {video.duration && <span className="text-slate-400 text-xs">{video.duration}</span>}
                      {video.youtubeUrl && (
                        <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors">
                          Watch
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
