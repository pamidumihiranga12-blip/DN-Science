import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, courses, bookOrders, enrollments, books } from "@/db/schema";
import { eq, count, sum, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [totalStudents] = await db.select({ count: count() }).from(users).where(eq(users.role, "student"));
    const [totalCourses] = await db.select({ count: count() }).from(courses).where(eq(courses.isPublished, true));
    const [totalBooks] = await db.select({ count: count() }).from(books).where(eq(books.isPublished, true));
    const [pendingEnrollments] = await db.select({ count: count() }).from(enrollments).where(eq(enrollments.status, "pending"));
    const [pendingOrders] = await db.select({ count: count() }).from(bookOrders).where(eq(bookOrders.status, "pending"));
    const [activeEnrollments] = await db.select({ count: count() }).from(enrollments).where(eq(enrollments.status, "active"));
    const revenueResult = await db.select({ total: sum(bookOrders.totalPrice) }).from(bookOrders).where(eq(bookOrders.status, "delivered"));

    return NextResponse.json({
      totalStudents: totalStudents.count,
      totalCourses: totalCourses.count,
      totalBooks: totalBooks.count,
      pendingEnrollments: pendingEnrollments.count,
      pendingOrders: pendingOrders.count,
      activeEnrollments: activeEnrollments.count,
      revenue: revenueResult[0]?.total || "0",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
