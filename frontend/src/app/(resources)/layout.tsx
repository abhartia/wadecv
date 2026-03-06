import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}
