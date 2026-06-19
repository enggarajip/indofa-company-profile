import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      {/* Desktop: offset sidebar. Mobile: offset topbar */}
      <div className="admin-main md:ml-64 ml-0 mt-14 md:mt-0">
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
