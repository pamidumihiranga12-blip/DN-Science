import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { books } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { BookOpen, Tag, CheckCircle, Package } from "lucide-react";
import OrderButton from "@/components/OrderButton";

export const dynamic = "force-dynamic";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let book: any = null;
  let session = null;

  try {
    if (process.env.DATABASE_URL && !isNaN(parseInt(id))) {
      const [foundBook] = await db.select().from(books).where(eq(books.id, parseInt(id))).limit(1);
      book = foundBook;
      session = await getSession();
    }
  } catch (error) {
    console.error("Database error on BookDetailPage:", error);
  }

  if (!book || !book.isPublished) notFound();

  return (
    <main>
      <Navbar />

      <section className="hero-gradient pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">{book.level}</span>
                {book.subject && <span className="text-blue-200 text-sm flex items-center gap-1"><Tag className="w-3 h-3" />{book.subject}</span>}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white font-poppins mb-4 leading-tight">{book.title}</h1>
              {book.description && <p className="text-blue-100 text-lg leading-relaxed mb-6">{book.description}</p>}

              <div className="flex flex-wrap gap-6 text-sm text-blue-200">
                <span className="flex items-center gap-2"><Package className="w-5 h-5" /> {book.stock > 0 ? `${book.stock} in stock` : "Out of Stock"}</span>
                <span className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Printed Book</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-2xl">
              <div className="text-center mb-6">
                <p className="text-slate-500 text-sm mb-1">Price</p>
                <p className="text-4xl font-bold text-indigo-700 font-poppins">{formatPrice(book.price)}</p>
                <p className="text-slate-500 text-xs mt-1">Per copy + delivery charges</p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "Printed & Delivered to your door",
                  "High-quality paper & print",
                  "Detailed answers included",
                  "Free delivery on orders above Rs. 2000",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <OrderButton bookId={book.id} price={book.price} isLoggedIn={!!session} inStock={book.stock > 0} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
