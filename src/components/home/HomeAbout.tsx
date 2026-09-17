import { CheckCircle, Award, GraduationCap, Lightbulb } from "lucide-react";

export default function HomeAbout() {
  const achievements = [
    "Best Educational Books Author of the Year (Global Laurel Awards 2026)",
    "Founder & Author of Science Pothigula",
    "B.Sc in Physics (University of Colombo)",
    "M.Sc in Science Education",
    "10+ years teaching O/L & A/L Science",
    "Author of popular science revision guides",
    "National Science Olympiad Trainer",
    "Awarded Best Teacher 2022",
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image & decorative */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl" />
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/teacher-photo.jpg"
                alt="Darshana Nuwan Sir"
                className="w-full h-[500px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-blue-900 font-poppins text-lg">Darshana Nuwan Sir</p>
                      <p className="text-slate-600 text-xs">Science Pothigula | O/L & A/L Science</p>
                    </div>
                    <span className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                      Award Winner 2026
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                    <span className="text-slate-600 text-sm ml-2 font-medium">4.9/5 (500+ reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -right-8 top-20 bg-white rounded-2xl p-4 shadow-xl border border-blue-100 animate-float">
              <GraduationCap className="w-8 h-8 text-blue-600 mb-1" />
              <p className="text-2xl font-bold text-blue-900">2000+</p>
              <p className="text-xs text-slate-600">Students Passed</p>
            </div>

            <div className="absolute -left-8 bottom-32 bg-white rounded-2xl p-4 shadow-xl border border-blue-100 animate-float" style={{ animationDelay: "1s" }}>
              <Award className="w-8 h-8 text-yellow-500 mb-1" />
              <p className="text-2xl font-bold text-blue-900">10+</p>
              <p className="text-xs text-slate-600">Years Teaching</p>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200">
              <Lightbulb className="w-4 h-4" />
              About Your Teacher
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 font-poppins leading-tight mb-6">
              Learn from the
              <span className="gradient-text block">Best in Science</span>
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Darshana Nuwan Sir is one of Sri Lanka's most experienced and dedicated science educators. 
              With over a decade of teaching experience, he has helped thousands of students achieve 
              excellent results in O/L and A/L examinations.
            </p>

            <p className="text-slate-600 leading-relaxed mb-8">
              His unique teaching methodology focuses on conceptual clarity, problem-solving skills, 
              and exam technique. Through engaging online videos and comprehensive study materials, 
              Sir makes complex science concepts simple and accessible to every student.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-slate-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
