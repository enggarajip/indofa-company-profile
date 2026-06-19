import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-[var(--navbar-height)]">
        {children}
      </main>
      <Footer />
    </>
  );
}
