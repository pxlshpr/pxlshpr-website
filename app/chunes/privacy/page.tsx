import Image from "next/image";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - Chunes",
  description: "Privacy policy for Chunes - Your music, your data, your control.",
};

export default function PrivacyPage() {
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
        <div className="container-app max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center pill pill-primary mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
            </div>
            <h1 className="mb-4">
              Your Music, <span className="gradient-text">Your Data</span>
            </h1>
            <p className="text-lg text-[var(--foreground-secondary)]">
              Last Updated: January 18, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 md:pb-24">
        <div className="container-app max-w-4xl">
          <div className="card p-8 md:p-12 space-y-10">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold mb-4 gradient-text">Introduction</h2>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                Chunes (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                and protect your information when you use the Chunes iOS
                application.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-bold mb-4 gradient-text">Information We Collect</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Apple Music Library Data</h3>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    Chunes accesses your Apple Music library to display and
                    organize your music. This includes song titles, artists,
                    albums, artwork, and playback information. This data is
                    processed locally on your device and synced via iCloud
                    (if enabled).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">User-Created Content</h3>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    We collect and store the tags, markers, filters, and
                    playlists you create within Chunes. This data is stored
                    locally on your device and optionally synced to our
                    backend service (Supabase) and iCloud for cross-device
                    synchronization.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Device Information</h3>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    We generate a unique device identifier to enable data
                    synchronization across your devices. This identifier is
                    used solely for sync purposes and is not linked to
                    personally identifiable information.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">External API Data</h3>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    When using the tag suggestion feature, Chunes may send
                    song metadata to third-party services (Last.fm, Genius,
                    Lyrics.ovh) to provide intelligent tag recommendations.
                    No personal information is shared with these services.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-bold mb-4 gradient-text">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-[var(--foreground-secondary)] leading-relaxed">
                <li>To provide core app functionality (tagging, filtering, playback)</li>
                <li>To synchronize your data across your devices via iCloud and our backend</li>
                <li>To provide intelligent tag suggestions using external APIs</li>
                <li>To improve and optimize the Chunes experience</li>
                <li>To send you push notifications about sync status (if enabled)</li>
              </ul>
            </div>

            {/* Data Storage and Synchronization */}
            <div>
              <h2 className="text-2xl font-bold mb-4 gradient-text">Data Storage and Synchronization</h2>
              <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
                Your data is primarily stored locally on your device. When
                synchronization is enabled, your tags, markers, and
                preferences are:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--foreground-secondary)] leading-relaxed">
                <li>Synced to iCloud using Apple&apos;s CloudKit framework (stored in your personal iCloud account)</li>
                <li>Optionally synced to our Supabase backend for enhanced cross-device functionality</li>
                <li>Encrypted in transit using industry-standard encryption (TLS/SSL)</li>
              </ul>
            </div>

            {/* Third-Party Services */}
            <div>
              <h2 className="text-2xl font-bold mb-4 gradient-text">Third-Party Services</h2>
              <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
                Chunes integrates with the following third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--foreground-secondary)] leading-relaxed">
                <li><strong>Apple Music/MusicKit:</strong> To access your music library and playback functionality</li>
                <li><strong>iCloud/CloudKit:</strong> For optional data synchronization across your Apple devices</li>
                <li><strong>Supabase:</strong> For backend data synchronization and storage</li>
                <li><strong>Last.fm, Genius, Lyrics.ovh:</strong> For tag suggestion and music metadata enrichment</li>
              </ul>
              <p className="text-[var(--foreground-secondary)] leading-relaxed mt-4">
                These services have their own privacy policies and terms of service. We recommend reviewing them.
              </p>
            </div>

            {/* Data Sharing */}
            <div>
              <h2 className="text-2xl font-bold mb-4 gradient-text">Data Sharing</h2>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                We do not sell, trade, or rent your personal information to
                third parties. We only share data with the third-party
                services listed above as necessary to provide app
                functionality.
              </p>
            </div>

            {/* Your Rights and Choices */}
            <div>
              <h2 className="text-2xl font-bold mb-4 gradient-text">Your Rights and Choices</h2>
              <ul className="list-disc list-inside space-y-2 text-[var(--foreground-secondary)] leading-relaxed">
                <li><strong>Access and Export:</strong> You can export all your data (tags, markers, playlists) directly from the app</li>
                <li><strong>Deletion:</strong> You can delete your data at any time by uninstalling the app and removing data from iCloud</li>
                <li><strong>Sync Control:</strong> You can enable or disable iCloud and backend synchronization in the app settings</li>
                <li><strong>Permissions:</strong> You can revoke Apple Music access at any time through iOS Settings</li>
              </ul>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-2xl font-bold mb-4 gradient-text">Children&apos;s Privacy</h2>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                Chunes is not directed to children under the age of 13. We do
                not knowingly collect personal information from children under 13.
              </p>
            </div>

            {/* Security */}
            <div>
              <h2 className="text-2xl font-bold mb-4 gradient-text">Security</h2>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                We implement reasonable security measures to protect your
                data, including encryption in transit and secure cloud
                storage. However, no method of electronic storage is 100%
                secure.
              </p>
            </div>

            {/* Changes to This Policy */}
            <div>
              <h2 className="text-2xl font-bold mb-4 gradient-text">Changes to This Policy</h2>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by updating the &ldquo;Last Updated&rdquo; date
                at the top of this policy.
              </p>
            </div>

            {/* Contact Us */}
            <div>
              <h2 className="text-2xl font-bold mb-4 gradient-text">Contact Us</h2>
              <p className="text-[var(--foreground-secondary)] leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:privacy@chunes.app"
                  className="text-[var(--accent-primary)] hover:underline"
                >
                  privacy@chunes.app
                </a>
                .
              </p>
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
              <Link href="/support" className="hover:text-[var(--accent-primary)] transition-colors">
                Support
              </Link>
              <span className="text-[var(--accent-primary)]">Privacy</span>
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
