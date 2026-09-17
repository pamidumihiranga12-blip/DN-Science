"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FlaskConical, LayoutDashboard, BookOpen, BookMarked, Users,
  ClipboardList, ShoppingBag, LogOut, Menu, X, Video, ChevronRight
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/books", label: "Books", icon: BookMarked },
  { href: "/admin/users", label: "Students", icon: Users },
  { href: "/admin/enrollments", label: "Enrollments", icon: ClipboardList },
  { href: "/admin/orders", label: "Book Orders", icon: ShoppingBag },
  { href: "/admin/video-access", label: "Video Access", icon: Video },
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-blue-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center border border-blue-400/30">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold font-poppins text-lg">DNS Science</p>
            <p className="text-blue-300 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Admin info */}
      <div className="px-4 py-4 border-b border-blue-800">
        <div className="flex items-center gap-3 bg-blue-800/50 rounded-xl p-3">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
            {adminName.charAt(0)}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{adminName}</p>
            <p className="text-blue-300 text-xs">Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                active
                  ? "bg-white text-blue-900 shadow-lg shadow-blue-900/20 font-semibold"
                  : "text-blue-100 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${active ? "text-blue-700" : "text-blue-300 group-hover:text-white"}`} />
              <span className="text-sm">{item.label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto text-blue-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-800">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-blue-200 hover:text-white hover:bg-blue-800 rounded-xl transition-all text-sm mb-2">
          <FlaskConical className="w-5 h-5" />
          View Website
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-300 hover:text-white hover:bg-red-600/30 rounded-xl transition-all w-full text-sm">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-900 to-blue-950 hidden lg:flex flex-col z-40 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-blue-900 flex items-center justify-between px-4 h-16 border-b border-blue-800">
        <Link href="/admin" className="flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-white" />
          <span className="text-white font-bold">DNS Admin</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-2">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-blue-900 to-blue-950 flex flex-col shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
