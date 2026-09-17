import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookOrders, books, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.role === "admin") {
      const result = await db
        .select({
          id: bookOrders.id,
          quantity: bookOrders.quantity,
          totalPrice: bookOrders.totalPrice,
          status: bookOrders.status,
          shippingAddress: bookOrders.shippingAddress,
          phone: bookOrders.phone,
          notes: bookOrders.notes,
          orderedAt: bookOrders.orderedAt,
          userId: bookOrders.userId,
          bookId: bookOrders.bookId,
          userName: users.name,
          userEmail: users.email,
          bookTitle: books.title,
          bookPrice: books.price,
        })
        .from(bookOrders)
        .leftJoin(users, eq(bookOrders.userId, users.id))
        .leftJoin(books, eq(bookOrders.bookId, books.id))
        .orderBy(desc(bookOrders.orderedAt));

      return NextResponse.json({ orders: result });
    }

    const result = await db
      .select({
        id: bookOrders.id,
        quantity: bookOrders.quantity,
        totalPrice: bookOrders.totalPrice,
        status: bookOrders.status,
        orderedAt: bookOrders.orderedAt,
        bookId: bookOrders.bookId,
        bookTitle: books.title,
        bookThumbnail: books.thumbnail,
      })
      .from(bookOrders)
      .leftJoin(books, eq(bookOrders.bookId, books.id))
      .where(eq(bookOrders.userId, session.userId))
      .orderBy(desc(bookOrders.orderedAt));

    return NextResponse.json({ orders: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookId, quantity, shippingAddress, phone, notes } = await req.json();
    if (!bookId || !shippingAddress || !phone) {
      return NextResponse.json({ error: "Book, address and phone required" }, { status: 400 });
    }

    const [book] = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
    if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

    const qty = quantity || 1;
    const totalPrice = (parseFloat(book.price) * qty).toFixed(2);

    const [order] = await db.insert(bookOrders).values({
      userId: session.userId,
      bookId,
      quantity: qty,
      totalPrice,
      shippingAddress,
      phone,
      notes,
      status: "pending",
    }).returning();

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
