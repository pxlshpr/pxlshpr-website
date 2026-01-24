"use client";

import Link from "next/link";

// iPhone 17 Pro Max frame component - realistic titanium design
function IPhoneFrame({
  children,
  className = "",
  size = "lg"
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    sm: "w-[230px]",
    md: "w-[280px]",
    lg: "w-[330px]",
    xl: "w-[380px]"
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-15 blur-[80px] scale-125 rounded-full" />

      {/* Phone body */}
      <div className="relative iphone-device">
        {/* Titanium frame with realistic styling */}
        <div className="iphone-outer-frame">
          {/* Inner titanium edge */}
          <div className="iphone-inner-frame">
            {/* Screen bezel (black) */}
            <div className="bg-black rounded-[49px] p-[6px]">
              {/* Actual screen */}
              <div className="relative bg-black rounded-[43px] overflow-hidden">
                {/* Dynamic Island */}
                <div className="
                  absolute top-[14px] left-1/2 -translate-x-1/2 z-20
                  w-[124px] h-[36px]
                  bg-black rounded-full
                  shadow-[inset_0_0_4px_rgba(0,0,0,0.8)]
                  flex items-center justify-center gap-[8px]
                ">
                  {/* Camera lens */}
                  <div className="w-[10px] h-[10px] rounded-full bg-[#1a1a2e] shadow-[inset_0_0_2px_rgba(0,0,0,0.8),0_0_1px_rgba(100,100,120,0.3)]" />
                  {/* Sensors */}
                  <div className="w-[6px] h-[6px] rounded-full bg-[#0d1117]" />
                </div>

                {/* Screen content - iPhone 17 Pro Max aspect ratio */}
                <div className="relative aspect-[440/956]">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side buttons - Left side */}
        <div className="iphone-button iphone-button-left" style={{ top: '100px', height: '32px' }} />
        <div className="iphone-button iphone-button-left" style={{ top: '155px', height: '56px' }} />
        <div className="iphone-button iphone-button-left" style={{ top: '225px', height: '56px' }} />

        {/* Side button - Right side (Power) */}
        <div className="iphone-button iphone-button-right" style={{ top: '175px', height: '80px' }} />
      </div>
    </div>
  );
}

// Theme-aware video/image component
// Supports both static images and looping videos
function AppMedia({
  name,
  alt,
  type = "video",
  className = ""
}: {
  name: string;
  alt: string;
  type?: "video" | "image";
  className?: string;
}) {
  if (type === "video") {
    return (
      <>
        {/* Dark mode video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          className={`absolute inset-0 w-full h-full object-cover object-top video-dark ${className}`}
          poster={`/nutrikit/screenshots/${name}-dark.png`}
        >
          <source src={`/nutrikit/videos/${name}-dark.mp4`} type="video/mp4" />
          {/* Fallback to image if video doesn't load */}
          <img
            src={`/nutrikit/screenshots/${name}-dark.png`}
            alt={alt}
            className="w-full h-full object-cover object-top"
          />
        </video>
        {/* Light mode video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          className={`absolute inset-0 w-full h-full object-cover object-top video-light ${className}`}
          poster={`/nutrikit/screenshots/${name}-light.png`}
        >
          <source src={`/nutrikit/videos/${name}-light.mp4`} type="video/mp4" />
          {/* Fallback to image if video doesn't load */}
          <img
            src={`/nutrikit/screenshots/${name}-light.png`}
            alt={alt}
            className="w-full h-full object-cover object-top"
          />
        </video>
      </>
    );
  }

  // Static image fallback
  return (
    <picture>
      <source
        srcSet={`/nutrikit/screenshots/${name}-dark.png`}
        media="(prefers-color-scheme: dark)"
      />
      <source
        srcSet={`/nutrikit/screenshots/${name}-light.png`}
        media="(prefers-color-scheme: light)"
      />
      <img
        src={`/nutrikit/screenshots/${name}-light.png`}
        alt={alt}
        className={`w-full h-full object-cover object-top ${className}`}
      />
    </picture>
  );
}

// Feature section component for detailed features
function FeatureSection({
  id,
  badge,
  title,
  titleHighlight,
  description,
  features,
  phonePosition = "left",
  mediaName,
  mediaType = "video",
}: {
  id: string;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  features: string[];
  phonePosition?: "left" | "right";
  mediaName: string;
  mediaType?: "video" | "image";
}) {
  const content = (
    <div className="flex flex-col justify-center">
      <span className="pill pill-primary mb-5 self-start text-sm font-semibold">{badge}</span>
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 leading-tight">
        {title} <span className="text-primary">{titleHighlight}</span>
      </h3>
      <p className="text-[var(--foreground-secondary)] text-lg md:text-xl mb-8 leading-relaxed">
        {description}
      </p>
      <ul className="space-y-4">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-[var(--foreground-secondary)] text-base md:text-lg">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const phone = (
    <div className="flex justify-center">
      <IPhoneFrame size="xl">
        <AppMedia name={mediaName} alt={`NutriKit - ${badge}`} type={mediaType} />
      </IPhoneFrame>
    </div>
  );

  return (
    <div id={id} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center scroll-mt-24">
      {phonePosition === "left" ? (
        <>
          <div className="order-2 lg:order-1">{phone}</div>
          <div className="order-1 lg:order-2">{content}</div>
        </>
      ) : (
        <>
          <div className="order-1">{content}</div>
          <div className="order-2">{phone}</div>
        </>
      )}
    </div>
  );
}

// Small feature card for the grid - clickable to scroll to section
function FeatureCard({
  icon,
  title,
  description,
  iconStyle,
  targetId
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconStyle: string;
  targetId: string;
}) {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div
      className="card-interactive p-6 md:p-8 cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className={`feature-icon ${iconStyle} mb-5`}>
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold mb-3">{title}</h3>
      <p className="text-[var(--foreground-secondary)] text-base md:text-lg leading-relaxed">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-[var(--border-default)]">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/nutrikit/app-icon.png" alt="NutriKit" className="w-9 h-9 rounded-xl" />
              <span className="font-semibold text-lg">NutriKit</span>
            </div>
            <Link
              href="https://testflight.apple.com/join/tWZZUg57"
              className="btn-primary btn-sm inline-flex items-center gap-2"
            >
              <span>Join Beta</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding overflow-hidden">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              {/* Beta badge */}
              <div className="inline-flex items-center gap-2 pill pill-primary mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse-soft" />
                Now in Beta
              </div>

              {/* Headline */}
              <h1 className="font-bold mb-6">
                Track Nutrition
                <br />
                <span className="gradient-text">Without the Friction</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-[var(--foreground-secondary)] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                The fastest way to log what you eat. Scan labels instantly, speak your meals naturally,
                and let intelligent goals adapt to your body.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="https://testflight.apple.com/join/tWZZUg57" className="btn-primary btn-lg inline-flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>Join TestFlight</span>
                </Link>
                <Link href="/nutrikit/block" className="btn-outline btn-lg inline-flex items-center">
                  <span>Track Development</span>
                </Link>
              </div>
            </div>

            {/* Right: iPhone */}
            <div className="flex justify-center lg:justify-end">
              <IPhoneFrame size="xl" className="animate-float">
                <AppMedia name="hero" alt="NutriKit App - Daily nutrition tracking" type="video" />
              </IPhoneFrame>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="section-padding bg-[var(--background-secondary)]">
        <div className="container-app">
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-bold mb-4">
              Built for <span className="gradient-text">Speed</span>
            </h2>
            <p className="text-lg text-[var(--foreground-secondary)] max-w-2xl mx-auto">
              Every interaction optimized. No waiting, no guessing, no friction.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              iconStyle="feature-icon-primary"
              targetId="feature-scanner"
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                </svg>
              }
              title="Instant Label Scanning"
              description="The fastest nutrition label scanner available. Handles complex two-column labels with ease and lets you verify values in seconds."
            />

            <FeatureCard
              iconStyle="feature-icon-secondary"
              targetId="feature-voice"
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                </svg>
              }
              title="Speak or Type Naturally"
              description="Just say what you ate. Intelligent matching connects your words to real foods from a verified database. No slow, inaccurate photo AI."
            />

            <FeatureCard
              iconStyle="feature-icon-calories"
              targetId="feature-goals"
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              }
              title="Goals That Adapt"
              description="Set protein per body weight. Calculate calories from your actual metabolic rate based on weight changes. Your goals evolve with you."
            />

            <FeatureCard
              iconStyle="feature-icon-health"
              targetId="feature-health"
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              }
              title="Deep Health Sync"
              description="Goals respond to your activity and biometrics. Export nutrition data back to Apple Health. Complete two-way health ecosystem connection."
            />
          </div>
        </div>
      </section>

      {/* Detailed Feature Sections */}
      <section className="section-padding">
        <div className="container-app space-y-24 md:space-y-32">

          {/* Feature 1: Label Scanning */}
          <FeatureSection
            id="feature-scanner"
            badge="Lightning Fast"
            title="Scan Labels in"
            titleHighlight="Seconds"
            description="Point your camera at any nutrition label and watch as values appear instantly. Our scanner handles the tricky two-column formats that trip up other apps."
            features={[
              "Recognizes two-column nutrition labels automatically",
              "Intuitive UI to verify and adjust scanned values",
              "Works offline - no waiting for cloud processing",
              "Saves scanned foods to your personal database"
            ]}
            phonePosition="left"
            mediaName="scanner"
          />

          {/* Feature 2: Natural Language */}
          <FeatureSection
            id="feature-voice"
            badge="Natural Input"
            title="Log Food by"
            titleHighlight="Speaking"
            description="Forget tedious searches. Just say 'two eggs and a slice of toast with butter' and watch as NutriKit matches your words to real foods from a verified database."
            features={[
              "Voice or text - whatever feels natural",
              "Matches to actual foods, not AI guesses",
              "Learns your common meals and portions",
              "Accurate nutrition from verified sources"
            ]}
            phonePosition="right"
            mediaName="voice"
          />

          {/* Feature 3: Dynamic Goals */}
          <FeatureSection
            id="feature-goals"
            badge="Precision Goals"
            title="Calories That"
            titleHighlight="Actually Work"
            description="Stop using generic formulas. NutriKit estimates your true metabolic rate from how your weight actually changes over time, then adjusts your targets automatically."
            features={[
              "7-day rolling average BMR + activity estimation",
              "Protein goals per kilogram of body weight",
              "Set deficit or surplus based on real data",
              "Goals that update as your body changes"
            ]}
            phonePosition="left"
            mediaName="goals"
          />

          {/* Feature 4: Health Integration */}
          <FeatureSection
            id="feature-health"
            badge="Health Ecosystem"
            title="Connected to"
            titleHighlight="Your Body"
            description="NutriKit doesn't exist in isolation. It reads your activity and biometrics to inform your goals, and writes your nutrition data back to Apple Health for a complete picture."
            features={[
              "Import activity calories from Apple Health",
              "Goals adjust based on daily movement",
              "Export all nutrition data to Health app",
              "Complete two-way data synchronization"
            ]}
            phonePosition="right"
            mediaName="health"
          />

        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[var(--background-secondary)]">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bold mb-4">
              Ready to <span className="gradient-text">Take Control?</span>
            </h2>
            <p className="text-lg text-[var(--foreground-secondary)] mb-8 max-w-xl mx-auto">
              Join the beta and experience nutrition tracking that actually keeps up with you.
            </p>

            <Link href="https://testflight.apple.com/join/tWZZUg57" className="btn-primary btn-lg inline-flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>Get Early Access</span>
            </Link>

            <p className="mt-4 text-sm text-[var(--foreground-tertiary)]">
              Free during beta. iOS only.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border-default)]">
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/nutrikit/app-icon.png" alt="NutriKit" className="w-6 h-6 rounded-lg" />
              <span className="text-sm text-[var(--foreground-secondary)]">
                &copy; {new Date().getFullYear()} NutriKit
              </span>
            </div>

            <p className="text-sm text-[var(--foreground-tertiary)]">
              You can&apos;t control what you don&apos;t measure.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/nutrikit/block"
                className="text-sm text-[var(--foreground-secondary)] hover:text-primary transition-colors"
              >
                Development
              </Link>
              <Link
                href="/"
                className="portfolio-link group"
                title="pxlshpr"
              >
                <svg className="w-6 h-6" viewBox="0 0 190 190" fill="none">
                  <circle cx="95" cy="95" r="95" className="fill-[var(--foreground)]/5 group-hover:fill-[var(--accent-primary)]/10 transition-colors duration-300"/>
                  <rect x="40" y="45" width="22" height="22" rx="4" className="fill-[var(--foreground)]/40 group-hover:fill-[#c084fc] transition-all duration-300"/>
                  <rect x="67" y="45" width="22" height="22" rx="4" className="fill-[var(--foreground)]/40 group-hover:fill-[#f472b6] transition-all duration-300 delay-[50ms]"/>
                  <rect x="94" y="45" width="22" height="22" rx="4" className="fill-[var(--foreground)]/40 group-hover:fill-[#fb923c] transition-all duration-300 delay-100"/>
                  <rect x="40" y="72" width="22" height="22" rx="4" className="fill-[var(--foreground)]/40 group-hover:fill-[#f472b6] transition-all duration-300 delay-[50ms]"/>
                  <rect x="67" y="72" width="22" height="22" rx="4" className="fill-[var(--foreground)]/40 group-hover:fill-[#2dd4bf] transition-all duration-300 delay-100"/>
                  <rect x="94" y="72" width="22" height="22" rx="4" className="fill-[var(--foreground)]/40 group-hover:fill-[#c084fc] transition-all duration-300 delay-150"/>
                  <rect x="121" y="72" width="22" height="22" rx="4" className="fill-[var(--foreground)]/40 group-hover:fill-[#f472b6] transition-all duration-300 delay-200"/>
                  <rect x="67" y="99" width="22" height="22" rx="4" className="fill-[var(--foreground)]/40 group-hover:fill-[#fb923c] transition-all duration-300 delay-150"/>
                  <rect x="94" y="99" width="22" height="22" rx="4" className="fill-[var(--foreground)]/40 group-hover:fill-[#f472b6] transition-all duration-300 delay-200"/>
                  <rect x="121" y="99" width="22" height="22" rx="4" className="fill-[var(--foreground)]/40 group-hover:fill-[#2dd4bf] transition-all duration-300 delay-[250ms]"/>
                  <path d="M147.123222,133.033551 L111.990998,101.393987 C111.029686,100.529417 109.490525,101.177848 109.45119,102.464283 L108.001389,149.49931 C107.933102,151.673701 110.396768,152.996588 112.195941,151.749231 L121.081536,145.593179 C121.956177,144.989034 123.169634,145.332775 123.584632,146.306688 L128.299208,157.316971 C129.494242,160.10594 132.672346,161.720484 135.545523,160.684053 C138.608045,159.577292 140.076269,156.171211 138.818166,153.233646 L133.980139,141.93204 C133.562526,140.960741 134.156116,139.853979 135.201463,139.650853 L145.841316,137.588392 C147.995039,137.17174 148.748852,134.497366 147.12302,133.033884 Z" className="fill-[var(--foreground)]/40 group-hover:fill-[url(#pxlGradFooter)] transition-all duration-500"/>
                  <defs>
                    <linearGradient id="pxlGradFooter" x1="-9.77%" y1="0%" x2="109.77%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc"/>
                      <stop offset="50%" stopColor="#f472b6"/>
                      <stop offset="100%" stopColor="#2dd4bf"/>
                    </linearGradient>
                  </defs>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
