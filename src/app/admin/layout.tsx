import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar adminName={session.name} />
      <main className="flex-1 min-w-0 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
