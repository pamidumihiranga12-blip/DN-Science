import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageCircle } from "lucide-react";

export default function HomeContact() {
  const contacts = [
    { icon: <Phone className="w-6 h-6" />, label: "Phone", value: "+94 77 123 4567", sub: "+94 71 234 5678", color: "bg-green-100 text-green-600" },
    { icon: <Mail className="w-6 h-6" />, label: "Email", value: "info@dnscience.lk", sub: "We reply within 24 hours", color: "bg-blue-100 text-blue-600" },
    { icon: <MapPin className="w-6 h-6" />, label: "Location", value: "Colombo, Sri Lanka", sub: "Online classes available", color: "bg-purple-100 text-purple-600" },
    { icon: <Clock className="w-6 h-6" />, label: "Hours", value: "Weekends 8AM – 6PM", sub: "Online: 24/7 access", color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <section className="py-24 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-blue-200">
            <MessageCircle className="w-4 h-4" />
            Get In Touch
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 font-poppins mb-4">
            Contact <span className="gradient-text">Us Today</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-lg">
            Have questions about our courses or need guidance? We're here to help you succeed.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contacts.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 text-center">
              <div className={`inline-flex items-center justify-center w-14 h-14 ${c.color} rounded-2xl mb-4`}>
                {c.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{c.label}</h3>
              <p className="text-slate-700 text-sm font-medium">{c.value}</p>
              <p className="text-slate-400 text-xs mt-1">{c.sub}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5"
          >
            Send us a Message
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
