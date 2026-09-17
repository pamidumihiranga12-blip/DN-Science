import Link from "next/link";
import { ArrowRight, BookOpen, Tag, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Book {
  id: number;
  title: string;
  description: string | null;
  level: string;
  subject: string | null;
  price: string;
  thumbnail: string | null;
  stock: number;
}

const levelColors: Record<string, string> = {
  OL: "bg-green-100 text-green-700",
  AL: "bg-purple-100 text-purple-700",
  Both: "bg-blue-100 text-blue-700",
};

export default function HomeBooks({ books }: { books: Book[] }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-indigo-200">
            <BookOpen className="w-4 h-4" />
            Study Materials
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 font-poppins mb-4">
            Textbooks &amp; <span className="gradient-text">Study Guides</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-lg">
            Carefully crafted books, model papers and revision guides to boost your exam preparation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {books.map((book, i) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-indigo-500/15 transition-all duration-300 hover:-translate-y-2 border border-slate-100"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Thumbnail */}
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 h-48 flex items-center justify-center overflow-hidden">
                {book.thumbnail ? (
                  <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-10">
                      {[...Array(6)].map((_, j) => (
                        <div
                          key={j}
                          className="absolute border border-white rounded"
                          style={{
                            width: `${30 + j * 8}px`,
                            height: `${40 + j * 10}px`,
                            left: `${10 + j * 12}%`,
                            top: `${20 + (j % 3) * 20}%`,
                            transform: `rotate(${-10 + j * 5}deg)`,
                          }}
                        />
                      ))}
                    </div>
                    <BookOpen className="w-14 h-14 text-white/80 group-hover:scale-110 transition-transform" />
                  </>
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
                  <div className="absolute bottom-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Content */}
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

        <div className="text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
          >
            View All Books
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
