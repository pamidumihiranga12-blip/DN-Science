import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { videos, courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();

    const [video] = await db.update(videos).set(body).where(eq(videos.id, parseInt(id))).returning();
    return NextResponse.json({ video });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const videoId = parseInt(id);

    const [video] = await db.select().from(videos).where(eq(videos.id, videoId)).limit(1);
    if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.delete(videos).where(eq(videos.id, videoId));

    // Update count
    const remaining = await db.select().from(videos).where(eq(videos.courseId, video.courseId));
    await db.update(courses).set({ totalVideos: remaining.length }).where(eq(courses.id, video.courseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
