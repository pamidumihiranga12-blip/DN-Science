import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { PlayCircle, Tag, ArrowRight, BookOpen, Filter } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const levelColors: Record<string, string> = {
  OL: "bg-green-100 text-green-700 border-green-200",
  AL: "bg-purple-100 text-purple-700 border-purple-200",
  Both: "bg-blue-100 text-blue-700 border-blue-200",
};

export default async function CoursesPage() {
  const allCourses = await db.select().from(courses).where(eq(courses.isPublished, true));

  const olCourses = allCourses.filter((c) => c.level === "OL" || c.level === "Both");
  const alCourses = allCourses.filter((c) => c.level === "AL" || c.level === "Both");

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            <BookOpen className="w-4 h-4" />
            {allCourses.length} Courses Available
          </div>
          <h1 className="text-5xl font-bold text-white font-poppins mb-4">
            Our Science <span className="text-blue-300">Courses</span>
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Comprehensive O/L and A/L science courses with video lessons, practice questions, and expert guidance from Darshana Nuwan Sir.
          </p>
        </div>
      </section>

      {/* O/L Courses */}
      {olCourses.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-poppins">O/L Courses</h2>
                <p className="text-slate-500 text-sm">Ordinary Level Science Programs</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {olCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* A/L Courses */}
      {alCourses.length > 0 && (
        <section className="py-16 section-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-poppins">A/L Courses</h2>
                <p className="text-slate-500 text-sm">Advanced Level Science Programs</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {alCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {allCourses.length === 0 && (
        <div className="py-32 text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600">No courses available yet</h3>
          <p className="text-slate-400 mt-2">Check back soon for new courses!</p>
        </div>
      )}

      <Footer />
    </main>
  );
}

function CourseCard({ course }: { course: { id: number; title: string; description: string | null; level: string; subject: string | null; price: string; thumbnail: string | null; totalVideos: number; isPublished: boolean } }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-300 hover:-translate-y-2 border border-slate-100"
    >
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
  );
}
