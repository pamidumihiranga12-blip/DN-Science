"use client";

import { useEffect, useRef, useState } from "react";
import { Users, BookOpen, Trophy, Clock } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function HomeStats() {
  const stats: Stat[] = [
    { icon: <Users className="w-8 h-8" />, value: 2000, suffix: "+", label: "Students Taught", color: "from-blue-500 to-blue-600" },
    { icon: <BookOpen className="w-8 h-8" />, value: 10, suffix: "+", label: "Courses Available", color: "from-indigo-500 to-indigo-600" },
    { icon: <Trophy className="w-8 h-8" />, value: 98, suffix: "%", label: "Pass Rate", color: "from-cyan-500 to-cyan-600" },
    { icon: <Clock className="w-8 h-8" />, value: 10, suffix: "+", label: "Years Experience", color: "from-blue-600 to-indigo-600" },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center p-6 glass rounded-2xl hover:bg-white/20 transition-all duration-300 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-white font-poppins mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
