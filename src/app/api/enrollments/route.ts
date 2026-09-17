import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { enrollments, courses, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (session.role === "admin") {
      const result = await db
        .select({
          id: enrollments.id,
          status: enrollments.status,
          enrolledAt: enrollments.enrolledAt,
          approvedAt: enrollments.approvedAt,
          notes: enrollments.notes,
          userId: enrollments.userId,
          courseId: enrollments.courseId,
          userName: users.name,
          userEmail: users.email,
          courseTitle: courses.title,
          coursePrice: courses.price,
        })
        .from(enrollments)
        .leftJoin(users, eq(enrollments.userId, users.id))
        .leftJoin(courses, eq(enrollments.courseId, courses.id))
        .orderBy(desc(enrollments.enrolledAt));

      return NextResponse.json({ enrollments: result });
    }

    // Student: own enrollments
    const targetUserId = userId ? parseInt(userId) : session.userId;
    if (targetUserId !== session.userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const result = await db
      .select({
        id: enrollments.id,
        status: enrollments.status,
        enrolledAt: enrollments.enrolledAt,
        approvedAt: enrollments.approvedAt,
        courseId: enrollments.courseId,
        courseTitle: courses.title,
        coursePrice: courses.price,
        courseThumbnail: courses.thumbnail,
        courseLevel: courses.level,
      })
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, targetUserId))
      .orderBy(desc(enrollments.enrolledAt));

    return NextResponse.json({ enrollments: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId, notes } = await req.json();
    if (!courseId) return NextResponse.json({ error: "Course ID required" }, { status: 400 });

    // Check if already enrolled
    const existing = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, session.userId))
      .limit(100);

    const alreadyEnrolled = existing.find((e) => e.courseId === courseId);
    if (alreadyEnrolled) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 });
    }

    const [enrollment] = await db.insert(enrollments).values({
      userId: session.userId,
      courseId,
      notes,
      status: "pending",
    }).returning();

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}
