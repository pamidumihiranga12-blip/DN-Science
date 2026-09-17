import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { studentVideoAccess, videos, courses, enrollments } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const targetUserId = userId ? parseInt(userId) : session.userId;

    if (session.role !== "admin" && targetUserId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get active enrollments for the user
    const activeEnrollments = await db
      .select({ courseId: enrollments.courseId })
      .from(enrollments)
      .where(and(eq(enrollments.userId, targetUserId), eq(enrollments.status, "active")));

    const enrolledCourseIds = activeEnrollments.map((e) => e.courseId);

    // Get all videos from enrolled courses
    let enrollmentVideos: typeof videos.$inferSelect[] = [];
    if (enrolledCourseIds.length > 0) {
      enrollmentVideos = await db.select().from(videos).where(inArray(videos.courseId, enrolledCourseIds));
    }

    // Get manually assigned videos
    const manualAccess = await db
      .select({ videoId: studentVideoAccess.videoId })
      .from(studentVideoAccess)
      .where(eq(studentVideoAccess.userId, targetUserId));

    const manualVideoIds = manualAccess.map((a) => a.videoId);

    let manualVideos: typeof videos.$inferSelect[] = [];
    if (manualVideoIds.length > 0) {
      manualVideos = await db.select().from(videos).where(inArray(videos.id, manualVideoIds));
    }

    // Merge and deduplicate
    const allVideoIds = new Set([...enrollmentVideos.map((v) => v.id), ...manualVideos.map((v) => v.id)]);
    const allVideos = [...enrollmentVideos, ...manualVideos].filter((v, idx, arr) => arr.findIndex((vv) => vv.id === v.id) === idx);

    return NextResponse.json({ videos: allVideos, totalCount: allVideoIds.size });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch student videos" }, { status: 500 });
  }
}

// Admin: grant/revoke video access
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { userId, videoId, action } = await req.json();
    if (!userId || !videoId || !action) return NextResponse.json({ error: "userId, videoId, action required" }, { status: 400 });

    if (action === "grant") {
      const existing = await db
        .select()
        .from(studentVideoAccess)
        .where(and(eq(studentVideoAccess.userId, userId), eq(studentVideoAccess.videoId, videoId)))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(studentVideoAccess).values({ userId, videoId, grantedByAdmin: true });
      }
      return NextResponse.json({ success: true, action: "granted" });
    } else if (action === "revoke") {
      await db.delete(studentVideoAccess).where(
        and(eq(studentVideoAccess.userId, userId), eq(studentVideoAccess.videoId, videoId))
      );
      return NextResponse.json({ success: true, action: "revoked" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to manage video access" }, { status: 500 });
  }
}
