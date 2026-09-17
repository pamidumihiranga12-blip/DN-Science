import Link from "next/link";
import { FlaskConical, Phone, Mail, MapPin, Share2, PlayCircle, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold font-poppins">
                  <span className="text-white">DN</span>
                  <span className="text-blue-400"> Science</span>
                </div>
                <p className="text-slate-400 text-sm">by Darshana Nuwan Sir</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Sri Lanka's premier online science tuition platform for O/L & A/L students. 
              Expert teaching, comprehensive study materials, and a proven track record of student success.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200">
                <PlayCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/courses", label: "Courses" },
                { href: "/books", label: "Books" },
                { href: "/contact", label: "Contact Us" },
                { href: "/login", label: "Student Login" },
                { href: "/register", label: "Register" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full group-hover:bg-blue-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm">+94 77 123 4567</p>
                  <p className="text-slate-400 text-sm">+94 71 234 5678</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-slate-400 text-sm">info@dnscience.lk</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-slate-400 text-sm">Colombo, Sri Lanka</p>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-blue-900/30 rounded-xl border border-blue-800/50">
              <p className="text-blue-300 text-xs font-medium mb-1">Class Hours</p>
              <p className="text-slate-400 text-xs">Weekends: 8:00 AM – 6:00 PM</p>
              <p className="text-slate-400 text-xs">Online: 24/7 access to videos</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} DN Science. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Designed for excellence in Sri Lankan science education
          </p>
        </div>
      </div>
    </footer>
  );
}
