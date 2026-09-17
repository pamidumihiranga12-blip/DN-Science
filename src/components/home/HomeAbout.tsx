import { CheckCircle, Award, GraduationCap, BookOpen, Star, Users, Trophy } from "lucide-react";

export default function HomeAbout() {
  const qualifications = [
    "B.Sc in Physics – University of Colombo",
    "M.Sc in Science Education",
    "Founder & Author of Science Pothigula",
    "National Science Olympiad Trainer",
    "10+ Years Teaching O/L & A/L Science",
    "Author of Popular Science Revision Guides",
    "National Award – Best Teacher 2022",
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-blue-200">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            About Your Teacher
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 font-poppins leading-tight">
            Learn from an <span className="gradient-text">Award-Winning</span>
            <br />Science Educator
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ===== LEFT: Photo + Award Certificate ===== */}
          <div className="space-y-6">

            {/* Main sir photo - award pose */}
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-blue-200 via-indigo-100 to-cyan-100 rounded-3xl blur-sm" />
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-blue-100">
                <img
                  src="/Sir photo.jpeg"
                  alt="Darshana Nuwan Sir holding Global Laurel Award 2026"
                  className="w-full object-cover"
                  style={{ objectPosition: "top center", maxHeight: "520px" }}
                />

                {/* Overlay name card */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-950 via-blue-900/80 to-transparent p-6 pt-16">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white font-bold text-xl font-poppins">Darshana Nuwan Sir</p>
                      <p className="text-blue-300 text-sm">Founder, Science Pothigula</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stat badges */}
              <div className="absolute -right-5 top-12 bg-white rounded-2xl px-4 py-3 shadow-xl border border-blue-100 text-center">
                <GraduationCap className="w-7 h-7 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-900 leading-none">2000+</p>
                <p className="text-xs text-slate-500 mt-0.5">Students</p>
              </div>
              <div className="absolute -left-5 top-40 bg-white rounded-2xl px-4 py-3 shadow-xl border border-blue-100 text-center">
                <Trophy className="w-7 h-7 text-yellow-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-900 leading-none">10+</p>
                <p className="text-xs text-slate-500 mt-0.5">Yrs Exp.</p>
              </div>
            </div>

            {/* Award Certificate image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-yellow-200 bg-black">
              <img
                src="/award-certificate.jpg"
                alt="Global Laurel Excellence Award 2026 – Best Educational Books Author"
                className="w-full object-cover opacity-95"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-yellow-300 text-xs font-semibold uppercase tracking-wider">🏅 Official Recognition</p>
                <p className="text-white font-bold text-sm mt-0.5">Global Laurel Excellence Awards 2026</p>
                <p className="text-yellow-200 text-xs">Best Educational Books Author of the Year</p>
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Bio + Qualifications ===== */}
          <div className="lg:pt-4">

            {/* Award highlight banner */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-5 mb-8 shadow-sm">
              <div className="bg-yellow-400 text-yellow-900 rounded-xl p-2.5 shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <p className="text-yellow-900 font-bold text-base">🏆 Global Laurel Excellence Awards 2026</p>
                <p className="text-yellow-800 text-sm mt-0.5">
                  <strong>Best Educational Books Author of the Year</strong> — awarded by the Global Laurel Group in recognition of outstanding achievement in science education across Sri Lanka.
                </p>
              </div>
            </div>

            {/* Bio paragraphs */}
            <p className="text-slate-700 text-lg leading-relaxed mb-4">
              <strong className="text-blue-900">Darshana Nuwan Sir</strong> is one of Sri Lanka's most experienced and 
              celebrated science educators. As the founder of <em>Science Pothigula</em>, 
              he has helped over <strong>2,000+ students</strong> achieve excellent results in O/L 
              and A/L examinations over more than a decade.
            </p>

            <p className="text-slate-600 leading-relaxed mb-4">
              His teaching style uniquely blends <em>conceptual clarity</em>, exam-focused strategies, 
              and real-world science applications — making even the most challenging topics 
              engaging and accessible. His award-winning revision books are used by 
              students across the island.
            </p>

            <p className="text-slate-600 leading-relaxed mb-8">
              Through his online platform, Sir now brings the same expert guidance to students 
              island-wide — with video lessons, downloadable study materials, and personalised 
              progress tracking, all from the comfort of home.
            </p>

            {/* Qualifications list */}
            <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm mb-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Qualifications & Achievements</h3>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {qualifications.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Users className="w-5 h-5 text-blue-600" />, value: "2000+", label: "Students", bg: "bg-blue-50 border-blue-100" },
                { icon: <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />, value: "4.9★", label: "Rating", bg: "bg-yellow-50 border-yellow-100" },
                { icon: <Trophy className="w-5 h-5 text-purple-600" />, value: "98%", label: "Pass Rate", bg: "bg-purple-50 border-purple-100" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}>
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <p className="text-2xl font-bold text-slate-900 font-poppins leading-none">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
