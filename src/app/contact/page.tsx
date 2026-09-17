"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // simulate sending
    setSent(true);
    setLoading(false);
  };

  const contacts = [
    { icon: <Phone className="w-6 h-6" />, title: "Phone", lines: ["+94 77 123 4567", "+94 71 234 5678"], color: "bg-green-500" },
    { icon: <Mail className="w-6 h-6" />, title: "Email", lines: ["info@dnscience.lk", "We reply within 24hrs"], color: "bg-blue-600" },
    { icon: <MapPin className="w-6 h-6" />, title: "Location", lines: ["Colombo, Sri Lanka", "Online classes island-wide"], color: "bg-purple-600" },
    { icon: <Clock className="w-6 h-6" />, title: "Class Hours", lines: ["Weekends: 8AM – 6PM", "Online: 24/7 access"], color: "bg-orange-500" },
  ];

  return (
    <main>
      <Navbar />

      <section className="hero-gradient pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white font-poppins mb-4">Contact <span className="text-blue-300">Us</span></h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">Have questions? We're here to help you on your science journey.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contacts.map((c) => (
              <div key={c.title} className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow border border-slate-100">
                <div className={`inline-flex items-center justify-center w-14 h-14 ${c.color} text-white rounded-2xl mb-4`}>
                  {c.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{c.title}</h3>
                {c.lines.map((l, i) => <p key={i} className={`text-sm ${i === 0 ? "text-slate-700 font-medium" : "text-slate-500"}`}>{l}</p>)}
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 font-poppins text-center mb-8">Send Us a Message</h2>

            {sent ? (
              <div className="text-center py-16">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-600">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-blue-600 font-semibold hover:text-blue-800 transition-colors">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name *</label>
                    <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 placeholder-slate-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+94 77 XXX XXXX"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 placeholder-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 placeholder-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject *</label>
                  <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="How can we help?" required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 placeholder-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
                  <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Your message..." rows={5} required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 placeholder-slate-400 resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
