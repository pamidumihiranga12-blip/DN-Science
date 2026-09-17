import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { books } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { BookOpen, Tag, ArrowRight, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const levelColors: Record<string, string> = {
  OL: "bg-green-100 text-green-700",
  AL: "bg-purple-100 text-purple-700",
  Both: "bg-blue-100 text-blue-700",
};

export default async function BooksPage() {
  const allBooks = await db.select().from(books).where(eq(books.isPublished, true));

  return (
    <main>
      <Navbar />

      <section className="hero-gradient pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            <BookOpen className="w-4 h-4" />
            {allBooks.length} Books Available
          </div>
          <h1 className="text-5xl font-bold text-white font-poppins mb-4">
            Study <span className="text-blue-300">Books & Materials</span>
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            High-quality textbooks, model paper collections, and revision guides written by Darshana Nuwan Sir for O/L and A/L students.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {allBooks.length === 0 ? (
            <div className="py-32 text-center">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600">No books available yet</h3>
              <p className="text-slate-400 mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-indigo-500/15 transition-all duration-300 hover:-translate-y-2 border border-slate-100"
                >
                  <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 h-48 flex items-center justify-center overflow-hidden">
                    {book.thumbnail ? (
                      <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-14 h-14 text-white/80 group-hover:scale-110 transition-transform" />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColors[book.level] || "bg-blue-100 text-blue-700"}`}>
                        {book.level}
                      </span>
                    </div>
                    {book.stock <= 5 && book.stock > 0 && (
                      <div className="absolute bottom-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-lg">
                        Only {book.stock} left!
                      </div>
                    )}
                    {book.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {book.subject && (
                      <div className="flex items-center gap-1 text-indigo-600 text-xs font-medium mb-2">
                        <Tag className="w-3 h-3" />
                        {book.subject}
                      </div>
                    )}
                    <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-indigo-700 transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    {book.description && (
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3">{book.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="font-bold text-indigo-700 text-lg">{formatPrice(book.price)}</span>
                      <span className="text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Order <ShoppingCart className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
