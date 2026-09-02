"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const email = "claudiobakker@gmail.com";

function AmsterdamTime() {
  const [time, setTime] = useState("");
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Amsterdam",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).formatToParts(now);
      const hour = Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Amsterdam",
          hour: "2-digit",
          hour12: false,
        }).format(now),
      );

      setTime(parts.map((part) => part.value).join(""));
      setIsDaytime(hour >= 7 && hour < 19);
    };

    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p className="footer-time">
      {isDaytime ? <SunIcon /> : <MoonIcon />}
      <span>{time ? `${time}, Amsterdam` : "Amsterdam"}</span>
    </p>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-identity">
        <div className="footer-name">
          <img src="/logo-claudio.svg" alt="" width="32" height="32" />
          <span>Claudio Bakker</span>
        </div>
        <AmsterdamTime />
      </div>

      <nav className="footer-navigation" aria-label="Footer navigation">
        <Link href="/">Work</Link>
        <Link href="/about">About</Link>
        <Link href="/resume">Resume</Link>
      </nav>

      <div className="footer-contact">
        <p>Let&apos;s work together!</p>
        <a
          href={`mailto:${email}`}
          className="copy-email"
        >
          <span>{email}</span>
          <svg
            className="email-arrow"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </a>
        <div className="social-links">
          <a
            href="https://www.linkedin.com/in/claudiobakker/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://github.com/claudiobak"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
        </div>
      </div>

      <p className="footer-credit">Designed + coded by Claudio</p>
    </footer>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation) => (
        <rect
          key={rotation}
          x="11.2"
          y="1.5"
          width="1.6"
          height="3"
          rx="0.8"
          transform={`rotate(${rotation} 12 12)`}
        />
      ))}
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 8.4H3.2V19h3.3V8.4ZM4.85 3A1.92 1.92 0 1 0 4.85 6.84 1.92 1.92 0 0 0 4.85 3ZM12 8.4H8.8V19H12v-5.24c0-1.38.26-2.72 1.98-2.72 1.7 0 1.72 1.59 1.72 2.81V19H19v-5.8c0-2.85-.61-5.04-3.94-5.04-1.6 0-2.66.88-3.1 1.71H12V8.4Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.82a9.5 9.5 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
