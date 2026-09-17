import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, phone: users.phone, school: users.school, grade: users.grade, role: users.role, status: users.status, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();

    const updateData: Record<string, unknown> = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      school: body.school,
      grade: body.grade,
      role: body.role,
      status: body.status,
      updatedAt: new Date(),
    };

    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    // Remove undefined
    Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k]);

    const [user] = await db.update(users).set(updateData).where(eq(users.id, parseInt(id))).returning({
      id: users.id, name: users.name, email: users.email, role: users.role, status: users.status,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    await db.delete(users).where(eq(users.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
