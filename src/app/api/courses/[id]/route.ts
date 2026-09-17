import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courses, videos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);

    const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
    if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const courseVideos = await db.select().from(videos).where(eq(videos.courseId, courseId)).orderBy(videos.orderIndex);

    return NextResponse.json({ course, videos: courseVideos });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const courseId = parseInt(id);
    const body = await req.json();

    const [course] = await db.update(courses).set({
      ...body,
      updatedAt: new Date(),
    }).where(eq(courses.id, courseId)).returning();

    return NextResponse.json({ course });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const courseId = parseInt(id);

    await db.delete(courses).where(eq(courses.id, courseId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
