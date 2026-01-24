"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PortfolioPage() {
  const particlesRef = useRef<HTMLDivElement>(null);
  const bgGradientRef = useRef<HTMLDivElement>(null);
  const [tooltipActive, setTooltipActive] = useState(false);

  useEffect(() => {
    // Create floating particles
    const particlesContainer = particlesRef.current;
    if (!particlesContainer) return;

    const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches;
    const colors = isLightMode
      ? ["#9333ea", "#ec4899", "#14b8a6", "#7c3aed", "#b45309"]
      : ["#c084fc", "#f472b6", "#2dd4bf", "#5D00FF", "#d4a944"];

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "portfolio-particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 15 + "s";
      particle.style.animationDuration = 15 + Math.random() * 10 + "s";
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      const size = 3 + Math.random() * 4;
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particlesContainer.appendChild(particle);
    }

    // Add subtle parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      if (bgGradientRef.current) {
        bgGradientRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleTooltipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setTooltipActive(!tooltipActive);
  };

  return (
    <>
      <div ref={bgGradientRef} className="portfolio-bg-gradient" />
      <div ref={particlesRef} className="portfolio-particles" />

      <div className="portfolio-container">
        <section className="portfolio-profile">
          {/* 3D Profile with Logo Behind */}
          <div className="portfolio-profile-3d-container">
            <div className="portfolio-profile-3d-scene">
              {/* Logo behind */}
              <div className="portfolio-logo-back">
                <picture>
                  <source srcSet="/logo-light.png" media="(prefers-color-scheme: light)" />
                  <Image
                    src="/logo-dark.png"
                    alt="pxlshpr logo"
                    width={160}
                    height={160}
                    priority
                  />
                </picture>
              </div>

              {/* Profile image front */}
              <div className="portfolio-profile-front">
                <div className="portfolio-profile-image-wrapper">
                  <div className="portfolio-profile-image-ring" />
                  <Image
                    src="/profile.jpg"
                    alt="Ahmed Ragheb Khalaf"
                    width={180}
                    height={180}
                    className="portfolio-profile-image"
                    priority
                  />
                  {/* Sushi emoji on hover */}
                  <span className="portfolio-sushi-hover">🍣</span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="portfolio-username">pxlshpr</h1>
          <p className="portfolio-username-expand">
            / <span>p</span>i<span>x</span>e<span>l</span> <span>sh</span>i<span>pp</span>e<span>r</span> /
          </p>

          <p className="portfolio-real-name">Ahmed Ragheb Khalaf</p>
          <p className="portfolio-instagram-handle">
            <a
              href="https://instagram.com/ahmdrghb"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="portfolio-instagram-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @ahmdrghb
            </a>
          </p>

          <p className="portfolio-role">
            <span
              className={`portfolio-tooltip-trigger ${tooltipActive ? "active" : ""}`}
              onClick={handleTooltipClick}
            >
              <strong>UX Engineer</strong>
              <span className="portfolio-tooltip">
                I have a <strong>Software Engineering</strong> degree from{" "}
                <strong>UWA</strong> in Australia and currently specialize in creating{" "}
                <strong>iOS apps</strong>.
              </span>
            </span>{" "}
            crafting delightful apps
          </p>
        </section>

        <section className="portfolio-apps-section">
          <h2 className="portfolio-apps-title">Currently Building</h2>

          <div className="portfolio-apps-grid">
            <Link href="/nutrikit" className="portfolio-app-card nutrikit">
              <Image
                src="/nutrikit-icon.png"
                alt="NutriKit"
                width={80}
                height={80}
                className="portfolio-app-icon"
              />
              <h3 className="portfolio-app-name">NutriKit</h3>
              <p className="portfolio-app-tagline">
                Lightning-fast, accurate nutrition tracking
              </p>
              <span className="portfolio-app-cta">Explore &rarr;</span>
            </Link>

            <Link href="/chunes" className="portfolio-app-card chunes">
              <Image
                src="/chunes-icon.png"
                alt="Chunes"
                width={80}
                height={80}
                className="portfolio-app-icon"
              />
              <h3 className="portfolio-app-name">Chunes</h3>
              <p className="portfolio-app-tagline">
                Tag your music, create mixes, drop markers
              </p>
              <span className="portfolio-app-cta">Explore &rarr;</span>
            </Link>
          </div>
        </section>

        <footer className="portfolio-footer">
          <p className="portfolio-footer-text">
            Made with <span>&hearts;</span> and lots of coffee
          </p>
        </footer>
      </div>
    </>
  );
}
