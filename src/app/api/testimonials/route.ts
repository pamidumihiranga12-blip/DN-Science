import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const result = await db.select().from(testimonials).where(eq(testimonials.isPublished, true)).orderBy(desc(testimonials.createdAt));
    return NextResponse.json({ testimonials: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const [testimonial] = await db.insert(testimonials).values(body).returning();
    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
