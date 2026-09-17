"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle, Star, ChevronDown } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${20 + i * 15}px`,
              height: `${20 + i * 15}px`,
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Molecular decorations */}
      <div className="absolute top-1/4 right-8 opacity-10 hidden lg:block">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
          <circle cx="150" cy="150" r="40" stroke="white" strokeWidth="2"/>
          <circle cx="80" cy="80" r="20" stroke="white" strokeWidth="2"/>
          <circle cx="220" cy="80" r="20" stroke="white" strokeWidth="2"/>
          <circle cx="80" cy="220" r="20" stroke="white" strokeWidth="2"/>
          <circle cx="220" cy="220" r="20" stroke="white" strokeWidth="2"/>
          <line x1="110" y1="110" x2="150" y2="150" stroke="white" strokeWidth="2"/>
          <line x1="190" y1="110" x2="150" y2="150" stroke="white" strokeWidth="2"/>
          <line x1="110" y1="190" x2="150" y2="150" stroke="white" strokeWidth="2"/>
          <line x1="190" y1="190" x2="150" y2="150" stroke="white" strokeWidth="2"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Sri Lanka's #1 Online Science Tuition
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-poppins leading-tight mb-6 animate-fade-in-up">
              Master
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                Science
              </span>
              with Confidence
            </h1>

            <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-lg animate-fade-in-up delay-200">
              Join thousands of O/L & A/L students learning Physics, Chemistry, Biology 
              and Mathematics with <strong className="text-white">Darshana Nuwan Sir's</strong> proven 
              teaching methods. Online videos, books, and expert guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl shadow-black/20 hover:-translate-y-1 hover:shadow-blue-500/30"
              >
                Browse Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur"
              >
                <PlayCircle className="w-5 h-5 text-blue-300" />
                Free Trial
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 mt-12 animate-fade-in-up delay-400">
              {[
                { value: "2000+", label: "Students" },
                { value: "10+", label: "Years Experience" },
                { value: "98%", label: "Pass Rate" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-blue-300 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Teacher card */}
          <div className="relative flex justify-center lg:justify-end animate-slide-in-right delay-200">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-3xl blur-2xl" />
              <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-6 max-w-sm">
                <div className="relative w-full aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden mb-4 shadow-inner bg-slate-900/50">
                  <img
                    src="/teacher-photo.jpg"
                    alt="Darshana Nuwan Sir"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent" />
                </div>

                <div className="text-center text-white">
                  <h3 className="text-xl font-bold font-poppins">Darshana Nuwan Sir</h3>
                  <p className="text-blue-200 text-sm mt-1">Science Pothigula | 10+ Years</p>
                  <span className="inline-block mt-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs px-3 py-1 rounded-full font-medium">
                    🏆 Global Laurel Award Winner 2026
                  </span>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -left-4 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg">
                  ⭐ Top Rated
                </div>
                <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg">
                  🎓 2000+ Students
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <span className="text-xs">Scroll Down</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
