"use client";

import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  school: string | null;
  grade: string | null;
  content: string;
  rating: number;
  avatar: string | null;
}

export default function HomeTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const prev = () => setActiveIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-white rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-white/20">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            Student Reviews
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white font-poppins mb-4">
            What Our Students Say
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto text-lg">
            Thousands of students have transformed their science results with DN Science.
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 md:p-12 text-center">
            <Quote className="w-12 h-12 text-blue-300/40 absolute top-6 left-6" />

            <div className="flex justify-center mb-4">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>

            <p className="text-white text-lg md:text-xl leading-relaxed mb-8 italic">
              "{testimonials[activeIndex].content}"
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonials[activeIndex].name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-white font-bold">{testimonials[activeIndex].name}</p>
                <p className="text-blue-300 text-sm">
                  {testimonials[activeIndex].grade && `${testimonials[activeIndex].grade} — `}
                  {testimonials[activeIndex].school}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all ${i === activeIndex ? "w-8 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Small cards */}
        <div className="grid sm:grid-cols-3 gap-4 hidden md:grid">
          {testimonials.slice(0, 3).map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveIndex(i)}
              className={`text-left p-5 rounded-2xl border transition-all duration-200 ${
                i === activeIndex
                  ? "bg-white/20 border-white/40"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-blue-300 text-xs">{t.grade}</p>
                </div>
              </div>
              <p className="text-blue-200 text-xs line-clamp-3">"{t.content}"</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
