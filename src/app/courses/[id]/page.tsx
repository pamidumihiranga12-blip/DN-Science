import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { courses, videos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { PlayCircle, Lock, Tag, Clock, Star, CheckCircle, ShoppingCart } from "lucide-react";
import EnrollButton from "@/components/EnrollButton";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courseId = parseInt(id);

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course || !course.isPublished) notFound();

  const courseVideos = await db.select().from(videos).where(eq(videos.courseId, courseId)).orderBy(videos.orderIndex);
  const session = await getSession();

  const freeVideos = courseVideos.filter((v) => v.isFree);
  const paidVideos = courseVideos.filter((v) => !v.isFree);

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">{course.level}</span>
                {course.subject && <span className="text-blue-200 text-sm">{course.subject}</span>}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white font-poppins mb-4 leading-tight">{course.title}</h1>
              {course.description && <p className="text-blue-100 text-lg leading-relaxed mb-6">{course.description}</p>}

              <div className="flex flex-wrap gap-6 text-sm text-blue-200">
                <span className="flex items-center gap-2"><PlayCircle className="w-5 h-5" /> {course.totalVideos} Video Lessons</span>
                <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> Self-paced Learning</span>
                <span className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" /> 4.9 Rating</span>
              </div>
            </div>

            {/* Price card */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
              <div className="text-center mb-6">
                <p className="text-slate-500 text-sm mb-1">Course Fee</p>
                <p className="text-4xl font-bold text-blue-700 font-poppins">{formatPrice(course.price)}</p>
                <p className="text-slate-500 text-xs mt-1">One-time payment | Lifetime access</p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  `${course.totalVideos}+ Video Lessons`,
                  "Study Notes & Materials",
                  "Past Paper Analysis",
                  "Doubt Clearing Sessions",
                  "Certificate of Completion",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <EnrollButton courseId={courseId} price={course.price} isLoggedIn={!!session} />
            </div>
          </div>
        </div>
      </section>

      {/* Video list */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 font-poppins mb-8">Course Content</h2>

          {courseVideos.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <PlayCircle className="w-12 h-12 mx-auto mb-3" />
              <p>Videos will be available soon after enrollment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Free videos */}
              {freeVideos.map((video, i) => (
                <div key={video.id} className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <PlayCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{video.title}</p>
                    {video.description && <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{video.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {video.duration && <span className="text-slate-400 text-xs">{video.duration}</span>}
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Free</span>
                  </div>
                </div>
              ))}

              {/* Paid videos */}
              {paidVideos.map((video) => (
                <div key={video.id} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-600 text-sm">{video.title}</p>
                    {video.description && <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{video.description}</p>}
                  </div>
                  {video.duration && <span className="text-slate-400 text-xs shrink-0">{video.duration}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
