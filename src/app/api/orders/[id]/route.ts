import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookOrders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const { status } = await req.json();

    const [order] = await db.update(bookOrders).set({
      status,
      updatedAt: new Date(),
    }).where(eq(bookOrders.id, parseInt(id))).returning();

    return NextResponse.json({ order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
