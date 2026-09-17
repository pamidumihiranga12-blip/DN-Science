import Link from "next/link";
import { ArrowRight, PlayCircle, BookOpen, Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Course {
  id: number;
  title: string;
  description: string | null;
  level: string;
  subject: string | null;
  price: string;
  thumbnail: string | null;
  totalVideos: number;
}

const levelColors: Record<string, string> = {
  OL: "bg-green-100 text-green-700 border-green-200",
  AL: "bg-purple-100 text-purple-700 border-purple-200",
  Both: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function HomeCourses({ courses }: { courses: Course[] }) {
  return (
    <section className="py-24 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-blue-200">
            <BookOpen className="w-4 h-4" />
            Our Courses
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 font-poppins mb-4">
            Popular <span className="gradient-text">Science Courses</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-lg">
            Comprehensive courses designed for O/L and A/L students, covering all topics with video lessons, notes, and past papers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courses.map((course, i) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-300 hover:-translate-y-2 border border-slate-100"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Thumbnail */}
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 h-44 flex items-center justify-center overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white/40 rounded-full" />
                      <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white/40 rounded-full" />
                    </div>
                    <PlayCircle className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform" />
                  </>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${levelColors[course.level] || "bg-blue-100 text-blue-700 border-blue-200"}`}>
                    {course.level}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-lg backdrop-blur flex items-center gap-1">
                  <PlayCircle className="w-3 h-3" />
                  {course.totalVideos} videos
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {course.subject && (
                  <div className="flex items-center gap-1 text-blue-600 text-xs font-medium mb-2">
                    <Tag className="w-3 h-3" />
                    {course.subject}
                  </div>
                )}
                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3">{course.description}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="font-bold text-blue-700 text-lg">{formatPrice(course.price)}</span>
                  <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Enroll <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
          >
            View All Courses
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
