import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { videos, courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { courseId, title, description, youtubeUrl, duration, orderIndex, isFree } = body;

    if (!courseId || !title) return NextResponse.json({ error: "CourseId and title required" }, { status: 400 });

    const [video] = await db.insert(videos).values({
      courseId,
      title,
      description,
      youtubeUrl,
      duration,
      orderIndex: orderIndex || 0,
      isFree: isFree ?? false,
    }).returning();

    // Update total_videos count
    const courseVideos = await db.select().from(videos).where(eq(videos.courseId, courseId));
    await db.update(courses).set({ totalVideos: courseVideos.length }).where(eq(courses.id, courseId));

    return NextResponse.json({ video }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}
