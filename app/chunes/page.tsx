"use client";

import Image from "next/image";
import {
  Tags,
  Sparkles,
  ListMusic,
  Timer,
  Music4,
  ArrowRight,
  Repeat,
  SlidersHorizontal,
  ArrowUpDown,
  Dumbbell,
  Guitar,
} from "lucide-react";

/* ============================================
   iPhone 17 Pro Max Frame Component
   ============================================ */
function IPhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`iphone-device ${className}`}>
      {/* Left buttons */}
      <div
        className="iphone-button iphone-button-left"
        style={{ top: "120px", height: "35px" }}
      />
      <div
        className="iphone-button iphone-button-left"
        style={{ top: "175px", height: "60px" }}
      />
      <div
        className="iphone-button iphone-button-left"
        style={{ top: "250px", height: "60px" }}
      />

      {/* Right button (power) */}
      <div
        className="iphone-button iphone-button-right"
        style={{ top: "180px", height: "80px" }}
      />

      {/* Outer frame */}
      <div className="iphone-outer-frame">
        {/* Inner frame */}
        <div className="iphone-inner-frame">
          {/* Screen */}
          <div className="relative bg-black rounded-[49px] overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="w-[120px] h-[35px] bg-black rounded-full flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#1a1a1a] mr-2" />
              </div>
            </div>

            {/* Screen content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   App Screenshot Component
   ============================================ */
function AppScreenshot({
  darkSrc,
  lightSrc,
  alt,
}: {
  darkSrc: string;
  lightSrc?: string;
  alt: string;
}) {
  return (
    <picture>
      {lightSrc && (
        <source media="(prefers-color-scheme: light)" srcSet={lightSrc} />
      )}
      <source media="(prefers-color-scheme: dark)" srcSet={darkSrc} />
      <img
        src={darkSrc}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ aspectRatio: "393/852" }}
      />
    </picture>
  );
}

/* ============================================
   Feature Card Component
   ============================================ */
function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  targetId,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: "purple" | "pink" | "orange" | "gold" | "teal";
  targetId?: string;
}) {
  const colorClasses = {
    purple: "feature-icon-purple",
    pink: "feature-icon-pink",
    orange: "feature-icon-orange",
    gold: "feature-icon-gold",
    teal: "feature-icon-teal",
  };

  const handleClick = () => {
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`card-interactive p-6 ${targetId ? "cursor-pointer" : ""}`}
      onClick={targetId ? handleClick : undefined}
    >
      <div className={`feature-icon ${colorClasses[color]} mb-4`}>
        <Icon className="w-6 h-6" strokeWidth={2} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-[var(--foreground-secondary)] text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ============================================
   Feature Section Component
   ============================================ */
function FeatureSection({
  id,
  title,
  description,
  features,
  screenshotDark,
  screenshotLight,
  reverse = false,
}: {
  id: string;
  title: string;
  description: string;
  features: { icon: React.ElementType; text: string }[];
  screenshotDark: string;
  screenshotLight?: string;
  reverse?: boolean;
}) {
  return (
    <section id={id} className="section-padding">
      <div className="container-app">
        <div
          className={`flex flex-col ${
            reverse ? "lg:flex-row-reverse" : "lg:flex-row"
          } items-center gap-12 lg:gap-20`}
        >
          {/* Text Content */}
          <div className="flex-1 max-w-xl">
            <h2 className="mb-6 gradient-text">{title}</h2>
            <p className="text-lg text-[var(--foreground-secondary)] mb-8 leading-relaxed">
              {description}
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] bg-opacity-20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <feature.icon
                      className="w-5 h-5 text-[var(--accent-primary)]"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-lg">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phone Mockup */}
          <div className="flex-shrink-0">
            <IPhoneFrame className="w-[230px] sm:w-[260px] md:w-[300px] lg:w-[340px] xl:w-[380px]">
              <AppScreenshot
                darkSrc={screenshotDark}
                lightSrc={screenshotLight}
                alt={title}
              />
            </IPhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Tag Pill Component
   ============================================ */
function TagPill({
  emoji,
  label,
  type,
}: {
  emoji?: string;
  label: string;
  type: "genre" | "mood" | "activity" | "instrument" | "teal";
}) {
  const typeClasses = {
    genre: "tag-genre",
    mood: "tag-mood",
    activity: "tag-activity",
    instrument: "tag-instrument",
    teal: "tag-teal",
  };

  return (
    <span className={`tag-pill ${typeClasses[type]}`}>
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
    </span>
  );
}

/* ============================================
   Main Page Component
   ============================================ */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-app relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-hero pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-[var(--border-default)]">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <Image
                  src="/chunes/chunes-icon.png"
                  alt="Chunes"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">Chunes</span>
            </div>

            {/* CTA */}
            <a
              href="https://testflight.apple.com/join/chunes"
              className="btn btn-primary btn-sm"
            >
              <span>Join Beta</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-8 md:pt-24 md:pb-16">
        <div className="container-app">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Hero Text */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="mb-6">
                <span className="pill pill-primary">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Music Organization
                </span>
              </div>

              {/* Headline */}
              <h1 className="mb-6">
                <span className="block">Organize</span>
                <span className="block gradient-text">Your Music</span>
                <span className="block">Your Way</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-[var(--foreground-secondary)] mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Smart tags, powerful mixes, instant replay markers, and seamless
                Apple Music integration. Finally, a music app that thinks like
                you do.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="https://testflight.apple.com/join/chunes"
                  className="btn btn-primary btn-lg inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span>Join TestFlight</span>
                </a>
                <a href="#features" className="btn btn-outline btn-lg">
                  Learn More
                </a>
              </div>
            </div>

            {/* Hero Phone */}
            <div className="flex-shrink-0">
              <IPhoneFrame className="w-[260px] sm:w-[300px] md:w-[340px] lg:w-[380px] xl:w-[420px] animate-float">
                <AppScreenshot
                  darkSrc="/chunes/screenshots/player-dark.png"
                  alt="Chunes Player"
                />
              </IPhoneFrame>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pills - Floating Tags */}
      <section className="py-8 md:py-12">
        <div className="container-app">
          <div className="flex flex-wrap justify-center gap-3">
            <TagPill emoji="🎸" label="Rock" type="genre" />
            <TagPill emoji="💪" label="Workout" type="activity" />
            <TagPill emoji="😌" label="Chill" type="mood" />
            <TagPill emoji="🎹" label="Piano" type="instrument" />
            <TagPill emoji="🔥" label="Energetic" type="mood" />
            <TagPill emoji="🎷" label="Jazz" type="genre" />
            <TagPill emoji="🚗" label="Road Trip" type="activity" />
            <TagPill emoji="🎻" label="Violin" type="instrument" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="section-padding">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="mb-4">
              Everything You <span className="gradient-text">Need</span>
            </h2>
            <p className="text-xl text-[var(--foreground-secondary)] max-w-2xl mx-auto">
              Built for power users who want complete control over their music
              library.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Tags}
              title="Smart Tags"
              description="100+ moods, 50+ activities, 1,300+ genres, 100+ instruments. AI-powered suggestions."
              color="purple"
              targetId="tags-section"
            />
            <FeatureCard
              icon={ListMusic}
              title="Custom Mixes"
              description="Save your perfect filter combinations. Filter by anything, sort by everything."
              color="pink"
              targetId="mixes-section"
            />
            <FeatureCard
              icon={Timer}
              title="Markers"
              description="Jump to any moment. Practice solos with instant replay buffers."
              color="orange"
              targetId="markers-section"
            />
            <FeatureCard
              icon={Music4}
              title="Apple Music"
              description="Built natively for iOS. Works seamlessly with your existing library."
              color="teal"
              targetId="apple-music-section"
            />
          </div>
        </div>
      </section>

      {/* Smart Tags Section */}
      <FeatureSection
        id="tags-section"
        title="AI-Powered Smart Tags"
        description="Categorize your music the way you think about it. With over 100 moods, 50 activities, 1,300 genres, and 100 instruments, you'll always find the perfect tag. Our AI analyzes your songs and suggests tags automatically."
        features={[
          {
            icon: Sparkles,
            text: "AI suggests tags based on your music",
          },
          {
            icon: Tags,
            text: "Moods like Calm, Energetic, Romantic, Dark",
          },
          {
            icon: Dumbbell,
            text: "Activities like Workout, Focus, Road Trip, Party",
          },
          {
            icon: Guitar,
            text: "Instruments like Piano, Guitar, Drums, Synth",
          },
        ]}
        screenshotDark="/chunes/screenshots/tags-dark.png"
      />

      {/* Custom Mixes Section */}
      <FeatureSection
        id="mixes-section"
        title="Custom Mixes"
        description="Create the perfect playlist for any moment. Combine multiple filters to find exactly what you want. Save your favorite combinations as Mixes and access them instantly."
        features={[
          {
            icon: SlidersHorizontal,
            text: "Filter by mood, activity, genre, instrument, vocals, artist, duration, release date",
          },
          {
            icon: ArrowUpDown,
            text: "Sort by date added, release date, play count, skip count, duration, last played",
          },
          {
            icon: ListMusic,
            text: "Save any filter combination as a reusable Mix with custom icons",
          },
        ]}
        screenshotDark="/chunes/screenshots/player-dark.png"
        reverse
      />

      {/* Markers Section */}
      <FeatureSection
        id="markers-section"
        title="Instant Replay Markers"
        description="Mark your favorite moments in any song. Jump instantly to that epic drop, the perfect verse, or the solo you want to practice. With configurable buffer playback, you can start 5, 10, or 15 seconds before the marker - perfect for warming up at the gym or nailing that guitar solo."
        features={[
          {
            icon: Timer,
            text: "Add unlimited markers to any song",
          },
          {
            icon: Repeat,
            text: "Buffer playback: hear 5-15 seconds before any marker",
          },
          {
            icon: Dumbbell,
            text: "Perfect for gym prep - get hyped with the buildup",
          },
          {
            icon: Guitar,
            text: "Practice solos - loop the lead-in until you nail it",
          },
        ]}
        screenshotDark="/chunes/screenshots/player-dark.png"
      />

      {/* Apple Music Section */}
      <FeatureSection
        id="apple-music-section"
        title="Native Apple Music Integration"
        description="Chunes works seamlessly with your entire Apple Music library - including music you've imported yourself. Upload DJ mixes or sets you've collected, mark all the drops with markers, and have the perfect gym playlist ready to go."
        features={[
          {
            icon: Music4,
            text: "Works with your full library - streaming and imported tracks",
          },
          {
            icon: Timer,
            text: "Mark every drop in your DJ mixes for instant gym hype",
          },
          {
            icon: Tags,
            text: "Tags and markers sync across all your devices via iCloud",
          },
        ]}
        screenshotDark="/chunes/screenshots/player-dark.png"
        reverse
      />

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-app">
          <div className="card p-8 md:p-12 text-center relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-hero opacity-50" />

            <div className="relative z-10">
              <h2 className="mb-4">
                Ready to Take <span className="gradient-text">Control?</span>
              </h2>
              <p className="text-xl text-[var(--foreground-secondary)] mb-8 max-w-xl mx-auto">
                Join the beta and be among the first to experience a new way to
                organize your music.
              </p>
              <a
                href="https://testflight.apple.com/join/chunes"
                className="btn btn-primary btn-lg inline-flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span>Join TestFlight</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-8">
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image
                  src="/chunes/chunes-icon.png"
                  alt="Chunes"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold">Chunes</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-[var(--foreground-secondary)]">
              <a
                href="/chunes/block"
                className="hover:text-[var(--accent-primary)] transition-colors"
              >
                Development
              </a>
              <a
                href="/chunes/privacy"
                className="hover:text-[var(--accent-primary)] transition-colors"
              >
                Privacy
              </a>
              <a
                href="/chunes/support"
                className="hover:text-[var(--accent-primary)] transition-colors"
              >
                Support
              </a>
            </div>

            {/* Copyright & Portfolio Link */}
            <div className="flex items-center gap-4">
              <p className="text-sm text-[var(--foreground-tertiary)]">
                &copy; 2026 Chunes
              </p>
              <a
                href="/"
                className="portfolio-link group"
                title="pxlshpr"
              >
                <svg className="w-6 h-6" viewBox="0 0 190 190" fill="none">
                  <circle cx="95" cy="95" r="95" className="fill-white/5 group-hover:fill-[var(--accent-primary)]/10 transition-colors duration-300"/>
                  <rect x="40" y="45" width="22" height="22" rx="4" className="fill-white/40 group-hover:fill-[#c084fc] transition-all duration-300"/>
                  <rect x="67" y="45" width="22" height="22" rx="4" className="fill-white/40 group-hover:fill-[#f472b6] transition-all duration-300 delay-[50ms]"/>
                  <rect x="94" y="45" width="22" height="22" rx="4" className="fill-white/40 group-hover:fill-[#fb923c] transition-all duration-300 delay-100"/>
                  <rect x="40" y="72" width="22" height="22" rx="4" className="fill-white/40 group-hover:fill-[#f472b6] transition-all duration-300 delay-[50ms]"/>
                  <rect x="67" y="72" width="22" height="22" rx="4" className="fill-white/40 group-hover:fill-[#2dd4bf] transition-all duration-300 delay-100"/>
                  <rect x="94" y="72" width="22" height="22" rx="4" className="fill-white/40 group-hover:fill-[#c084fc] transition-all duration-300 delay-150"/>
                  <rect x="121" y="72" width="22" height="22" rx="4" className="fill-white/40 group-hover:fill-[#f472b6] transition-all duration-300 delay-200"/>
                  <rect x="67" y="99" width="22" height="22" rx="4" className="fill-white/40 group-hover:fill-[#fb923c] transition-all duration-300 delay-150"/>
                  <rect x="94" y="99" width="22" height="22" rx="4" className="fill-white/40 group-hover:fill-[#f472b6] transition-all duration-300 delay-200"/>
                  <rect x="121" y="99" width="22" height="22" rx="4" className="fill-white/40 group-hover:fill-[#2dd4bf] transition-all duration-300 delay-[250ms]"/>
                  <path d="M147.123222,133.033551 L111.990998,101.393987 C111.029686,100.529417 109.490525,101.177848 109.45119,102.464283 L108.001389,149.49931 C107.933102,151.673701 110.396768,152.996588 112.195941,151.749231 L121.081536,145.593179 C121.956177,144.989034 123.169634,145.332775 123.584632,146.306688 L128.299208,157.316971 C129.494242,160.10594 132.672346,161.720484 135.545523,160.684053 C138.608045,159.577292 140.076269,156.171211 138.818166,153.233646 L133.980139,141.93204 C133.562526,140.960741 134.156116,139.853979 135.201463,139.650853 L145.841316,137.588392 C147.995039,137.17174 148.748852,134.497366 147.12302,133.033884 Z" className="fill-white/40 group-hover:fill-[url(#pxlGradFooter)] transition-all duration-500"/>
                  <defs>
                    <linearGradient id="pxlGradFooter" x1="-9.77%" y1="0%" x2="109.77%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc"/>
                      <stop offset="50%" stopColor="#f472b6"/>
                      <stop offset="100%" stopColor="#2dd4bf"/>
                    </linearGradient>
                  </defs>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
