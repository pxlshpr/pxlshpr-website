import Image from "next/image";
import Link from "next/link";
import {
  HelpCircle,
  ArrowLeft,
  Mail,
  Bug,
  Lightbulb,
  Book,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Support - Chunes",
  description: "Get help with Chunes. FAQ, troubleshooting, and contact information.",
};

const faqs: { question: string; answer: string; highlighted?: boolean }[] = [
  {
    question: "Why doesn't Chunes support Spotify?",
    answer:
      'We\'d love to support Spotify, but unfortunately their <a href="https://developer.spotify.com/blog/2025-04-15-updating-the-criteria-for-web-api-extended-access" target="_blank" rel="noopener noreferrer" class="text-[var(--accent-primary)] hover:underline">recent API policy changes</a> make it impossible for independent developers and startups. Spotify now requires a minimum of 250,000 monthly active users just to get extended API access - creating a catch-22 where you can\'t grow without access, but can\'t get access without already having grown. They also only accept applications from registered organizations, not individuals. Until Spotify changes these policies, Chunes is built exclusively for Apple Music.',
    highlighted: true,
  },
  {
    question: "How do I get started with Chunes?",
    answer:
      'After installing Chunes, you\'ll be prompted to grant Apple Music access. Once granted, tap "Import Library" to bring your music into Chunes. Then start tagging and organizing your songs!',
  },
  {
    question: "How does sync work?",
    answer:
      "Chunes syncs your tags, markers, and playlists across all your devices using iCloud and our backend service. You can enable or disable sync in Settings. Your music library itself remains in Apple Music.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes! You can export all your tags, markers, and playlists from Settings > Export Data. This gives you a complete backup of your music organization in JSON format.",
  },
  {
    question: "What are markers?",
    answer:
      "Markers let you bookmark specific moments in songs. Great for jumping to your favorite verse, chorus, or drop. You can add unlimited markers to any song and use buffer playback to practice or get hyped.",
  },
  {
    question: "How do tag suggestions work?",
    answer:
      "When you enable tag suggestions, Chunes uses Last.fm, Genius, and other music databases to recommend relevant tags based on song metadata, lyrics, and community data.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. Your music data stays on your device and in your personal iCloud account. We don't sell or share your data.",
  },
  {
    question: "What iOS version do I need?",
    answer:
      "Chunes requires iOS 18.2 or later. It's optimized for the latest iOS features and performance.",
  },
];

const contactOptions = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    action: "support@chunes.app",
    link: "mailto:support@chunes.app",
    color: "purple" as const,
  },
  {
    icon: Bug,
    title: "Report a Bug",
    description: "Found something broken?",
    action: "bugs@chunes.app",
    link: "mailto:bugs@chunes.app",
    color: "pink" as const,
  },
  {
    icon: Lightbulb,
    title: "Feature Request",
    description: "Share your ideas",
    action: "ideas@chunes.app",
    link: "mailto:ideas@chunes.app",
    color: "orange" as const,
  },
];

export default function SupportPage() {
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
            <Link href="/" className="btn btn-outline btn-sm">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="relative py-16 md:py-24">
        <div className="container-app">
          <div className="text-center mb-12">
            <div className="inline-flex items-center pill pill-primary mb-6">
              <HelpCircle className="w-4 h-4 mr-2" />
              Support
            </div>
            <h1 className="mb-4">
              How Can We <span className="gradient-text">Help?</span>
            </h1>
            <p className="text-xl text-[var(--foreground-secondary)] max-w-2xl mx-auto">
              Find answers to common questions or get in touch with our support team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="pb-12 md:pb-16">
        <div className="container-app">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactOptions.map((option) => (
              <a
                key={option.title}
                href={option.link}
                className="block"
              >
                <div className="card-interactive p-6 md:p-8 text-center h-full">
                  <div className={`feature-icon feature-icon-${option.color} mx-auto mb-4`}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  <p className="text-sm text-[var(--foreground-secondary)] mb-3">
                    {option.description}
                  </p>
                  <p className="text-sm font-semibold text-[var(--accent-primary)]">
                    {option.action}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-16 md:pb-24">
        <div className="container-app max-w-4xl">
          <div className="text-center mb-10 md:mb-12">
            <h2>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`card p-6 md:p-8 ${
                  faq.highlighted
                    ? "ring-2 ring-[var(--accent-secondary)] bg-[var(--accent-secondary)]/5"
                    : ""
                }`}
              >
                {faq.highlighted && (
                  <span className="tag-pill tag-mood text-xs mb-3 inline-block">Important</span>
                )}
                <h3 className={`font-bold mb-3 ${faq.highlighted ? "text-xl" : "text-lg"}`}>
                  {faq.question}
                </h3>
                <p
                  className="text-[var(--foreground-secondary)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="pb-16 md:pb-24">
        <div className="container-app">
          <div className="card p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-hero opacity-50" />
            <div className="relative z-10">
              <Book className="w-12 h-12 mx-auto mb-6 text-[var(--accent-primary)]" />
              <h2 className="mb-4">
                Still Need <span className="gradient-text">Help?</span>
              </h2>
              <p className="text-lg text-[var(--foreground-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed">
                Our support team is here for you. We typically respond within 24 hours.
              </p>
              <a href="mailto:support@chunes.app" className="btn btn-primary btn-lg inline-flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>Contact Support</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-8 relative z-10">
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image
                  src="/chunes-icon.png"
                  alt="Chunes"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold">Chunes</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-[var(--foreground-secondary)]">
              <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
                Home
              </Link>
              <Link href="/block" className="hover:text-[var(--accent-primary)] transition-colors">
                Development
              </Link>
              <span className="text-[var(--accent-primary)]">Support</span>
              <Link href="/privacy" className="hover:text-[var(--accent-primary)] transition-colors">
                Privacy
              </Link>
            </div>

            <p className="text-sm text-[var(--foreground-tertiary)]">
              &copy; 2026 Chunes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
