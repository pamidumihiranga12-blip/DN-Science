import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { books } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const session = await getSession();
    const isAdmin = session?.role === "admin";

    const result = isAdmin && all
      ? await db.select().from(books).orderBy(desc(books.createdAt))
      : await db.select().from(books).where(eq(books.isPublished, true)).orderBy(desc(books.createdAt));

    return NextResponse.json({ books: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { title, description, level, subject, price, thumbnail, stock, isPublished } = body;

    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const [book] = await db.insert(books).values({
      title, description, level: level || "OL", subject,
      price: price || "0", thumbnail, stock: stock || 0, isPublished: isPublished ?? true,
    }).returning();

    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
