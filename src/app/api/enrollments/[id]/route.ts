import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { enrollments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const { status } = await req.json();

    const [enrollment] = await db.update(enrollments).set({
      status,
      approvedAt: status === "active" ? new Date() : undefined,
      updatedAt: new Date(),
    }).where(eq(enrollments.id, parseInt(id))).returning();

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 });
  }
}
