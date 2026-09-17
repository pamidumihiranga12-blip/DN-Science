import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const session = await getSession();
    const isAdmin = session?.role === "admin";

    let query = db.select().from(courses).orderBy(desc(courses.createdAt));

    const result = await (isAdmin && all ? query : db.select().from(courses).where(eq(courses.isPublished, true)).orderBy(desc(courses.createdAt)));
    return NextResponse.json({ courses: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, level, subject, price, thumbnail, isPublished } = body;

    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const [course] = await db.insert(courses).values({
      title,
      description,
      level: level || "OL",
      subject,
      price: price || "0",
      thumbnail,
      isPublished: isPublished ?? true,
    }).returning();

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
