import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface DocPageProps {
  params: Promise<{ id: string; docId: string }>;
}

export async function generateMetadata({ params }: DocPageProps) {
  const { id } = await params;
  return {
    title: `Document - ${id} - Chunes`,
    description: `View documentation for task ${id}`,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { id, docId } = await params;

  return (
    <div className="min-h-screen bg-gradient-app relative">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-hero pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-[var(--border-default)]">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <Image
                  src="/chunes-icon.png"
                  alt="Chunes"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">Chunes</span>
            </Link>

            {/* Back Button */}
            <Link href={`/block/task/${id}`} className="btn btn-outline btn-sm">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {id}</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container-app py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="card p-12 text-center">
            <div className="text-6xl mb-6">📄</div>
            <h2 className="text-2xl font-bold mb-4">
              <span className="gradient-text">Document Not Available</span>
            </h2>
            <p className="text-[var(--foreground-secondary)] mb-2">
              Documents are managed in Linear and not available in this view.
            </p>
            <p className="text-xs text-[var(--foreground-tertiary)] mb-6">
              Document ID: {docId}
            </p>
            <Link href={`/block/task/${id}`} className="btn btn-primary">
              Back to Task
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-8 relative z-10">
        <div className="container-app text-center">
          <p className="text-sm text-[var(--foreground-tertiary)]">
            &copy; {new Date().getFullYear()} Chunes. Building in public.
          </p>
        </div>
      </footer>
    </div>
  );
}
