import { db } from "@/db";
import { users, courses, bookOrders, enrollments, books } from "@/db/schema";
import { eq, count, sum } from "drizzle-orm";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Users, BookOpen, ShoppingBag, ClipboardList, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    [totalStudents],
    [totalCourses],
    [totalBooks],
    [pendingEnrollments],
    [pendingOrders],
    [activeEnrollments],
    revenueResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(users).where(eq(users.role, "student")),
    db.select({ count: count() }).from(courses).where(eq(courses.isPublished, true)),
    db.select({ count: count() }).from(books).where(eq(books.isPublished, true)),
    db.select({ count: count() }).from(enrollments).where(eq(enrollments.status, "pending")),
    db.select({ count: count() }).from(bookOrders).where(eq(bookOrders.status, "pending")),
    db.select({ count: count() }).from(enrollments).where(eq(enrollments.status, "active")),
    db.select({ total: sum(bookOrders.totalPrice) }).from(bookOrders).where(eq(bookOrders.status, "delivered")),
  ]);

  const revenue = revenueResult[0]?.total || "0";

  const recentEnrollments = await db
    .select({
      id: enrollments.id,
      status: enrollments.status,
      enrolledAt: enrollments.enrolledAt,
      userName: users.name,
      courseTitle: courses.title,
    })
    .from(enrollments)
    .leftJoin(users, eq(enrollments.userId, users.id))
    .leftJoin(courses, eq(enrollments.courseId, courses.id))
    .orderBy(enrollments.enrolledAt)
    .limit(5);

  const recentOrders = await db
    .select({
      id: bookOrders.id,
      status: bookOrders.status,
      totalPrice: bookOrders.totalPrice,
      orderedAt: bookOrders.orderedAt,
      userName: users.name,
      bookTitle: books.title,
    })
    .from(bookOrders)
    .leftJoin(users, eq(bookOrders.userId, users.id))
    .leftJoin(books, eq(bookOrders.bookId, books.id))
    .orderBy(bookOrders.orderedAt)
    .limit(5);

  const stats = [
    { label: "Total Students", value: totalStudents.count, icon: <Users className="w-7 h-7" />, color: "from-blue-600 to-blue-700", link: "/admin/users" },
    { label: "Active Courses", value: totalCourses.count, icon: <BookOpen className="w-7 h-7" />, color: "from-indigo-600 to-indigo-700", link: "/admin/courses" },
    { label: "Published Books", value: totalBooks.count, icon: <ShoppingBag className="w-7 h-7" />, color: "from-purple-600 to-purple-700", link: "/admin/books" },
    { label: "Active Enrollments", value: activeEnrollments.count, icon: <CheckCircle className="w-7 h-7" />, color: "from-green-600 to-green-700", link: "/admin/enrollments" },
    { label: "Pending Enrollments", value: pendingEnrollments.count, icon: <Clock className="w-7 h-7" />, color: "from-yellow-500 to-yellow-600", link: "/admin/enrollments" },
    { label: "Pending Orders", value: pendingOrders.count, icon: <AlertCircle className="w-7 h-7" />, color: "from-orange-500 to-orange-600", link: "/admin/orders" },
    { label: "Revenue (Delivered)", value: formatPrice(revenue), icon: <TrendingUp className="w-7 h-7" />, color: "from-teal-600 to-teal-700", link: "/admin/orders" },
    { label: "Total Enrollments", value: activeEnrollments.count + pendingEnrollments.count, icon: <ClipboardList className="w-7 h-7" />, color: "from-slate-600 to-slate-700", link: "/admin/enrollments" },
  ];

  const statusColor: Record<string, string> = {
    pending: "badge-pending", active: "badge-active", rejected: "badge-rejected",
    confirmed: "badge-confirmed", shipped: "badge-shipped", delivered: "badge-delivered", cancelled: "badge-cancelled",
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-poppins">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of DNS Science platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.link} className="group">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all hover:-translate-y-0.5">
              <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${stat.color} text-white rounded-2xl mb-3 group-hover:scale-105 transition-transform`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      {(pendingEnrollments.count > 0 || pendingOrders.count > 0) && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Pending Actions Required
          </h3>
          <div className="flex flex-wrap gap-3">
            {pendingEnrollments.count > 0 && (
              <Link href="/admin/enrollments" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                Review {pendingEnrollments.count} Enrollment{pendingEnrollments.count > 1 ? "s" : ""}
              </Link>
            )}
            {pendingOrders.count > 0 && (
              <Link href="/admin/orders" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                Process {pendingOrders.count} Order{pendingOrders.count > 1 ? "s" : ""}
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-blue-600" />Recent Enrollments</h2>
            <Link href="/admin/enrollments" className="text-blue-600 text-sm font-medium hover:text-blue-800">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentEnrollments.length === 0 ? (
              <div className="p-8 text-center text-slate-400"><p>No enrollments yet</p></div>
            ) : (
              recentEnrollments.map((e) => (
                <div key={e.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{e.userName}</p>
                    <p className="text-slate-400 text-xs">{e.courseTitle}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor[e.status] || ""}`}>
                    {e.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-indigo-600" />Recent Book Orders</h2>
            <Link href="/admin/orders" className="text-indigo-600 text-sm font-medium hover:text-indigo-800">View All →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400"><p>No orders yet</p></div>
            ) : (
              recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{o.userName}</p>
                    <p className="text-slate-400 text-xs">{o.bookTitle} · {formatPrice(o.totalPrice || "0")}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor[o.status] || ""}`}>
                    {o.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
