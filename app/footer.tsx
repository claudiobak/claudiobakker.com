"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

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
  const [creatureMessage, setCreatureMessage] = useState<string | null>(null);
  const [hoverMessage, setHoverMessage] = useState<string | null>(null);
  const [pokeMessage, setPokeMessage] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const wasReturning = useRef(false);
  const lastGreeting = useRef(-1);
  const dragStart = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);
  const pokeTimer = useRef<number | undefined>(undefined);
  const pokeInFlight = useRef(false);

  const ordinal = (count: number) => {
    const remainder = count % 100;
    const suffix =
      remainder >= 11 && remainder <= 13
        ? "th"
        : count % 10 === 1
          ? "st"
          : count % 10 === 2
            ? "nd"
            : count % 10 === 3
              ? "rd"
              : "th";

    return `${count}${suffix}`;
  };

  const greetVisitor = () => {
    const greetings = ["oh hey!", "hello there!", "you found me!", "hi!"];
    let nextGreeting = Math.floor(Math.random() * greetings.length);

    if (nextGreeting === lastGreeting.current) {
      nextGreeting = (nextGreeting + 1) % greetings.length;
    }

    lastGreeting.current = nextGreeting;
    setHoverMessage(greetings[nextGreeting]);
  };

  const pokeCreature = async () => {
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }
    if (pokeInFlight.current) return;

    pokeInFlight.current = true;
    setPokeMessage("ouch!");

    const storedCount = Number.parseInt(
      window.localStorage.getItem("creature-poke-count") ?? "0",
      10,
    );
    const fallbackCount = Number.isNaN(storedCount) ? 1 : storedCount + 1;

    try {
      const response = await fetch("/api/poke", { method: "POST" });
      if (!response.ok) throw new Error("Global counter unavailable");

      const data = (await response.json()) as { count?: number };
      if (typeof data.count !== "number") throw new Error("Invalid counter");

      window.localStorage.setItem("creature-poke-count", String(data.count));
      setPokeMessage(
        `this is the ${ordinal(data.count)} time someone has poked me :(`,
      );
    } catch {
      window.localStorage.setItem("creature-poke-count", String(fallbackCount));
      setPokeMessage(
        `this is the ${ordinal(fallbackCount)} time you've poked me :(`,
      );
    } finally {
      pokeInFlight.current = false;
      if (pokeTimer.current) window.clearTimeout(pokeTimer.current);
      pokeTimer.current = window.setTimeout(() => setPokeMessage(null), 3200);
    }
  };

  useEffect(() => {
    const messages = [
      "ouch!",
      "hmm, interesting.",
      "still scrolling?",
      "nice choice!",
      "almost there...",
    ];
    let messageIndex = 0;
    let hideTimer: number | undefined;

    const showMessage = () => {
      setCreatureMessage(messages[messageIndex % messages.length]);
      messageIndex += 1;
      hideTimer = window.setTimeout(() => setCreatureMessage(null), 2400);
    };

    const firstMessage = window.setTimeout(showMessage, 3000);
    const messageLoop = window.setInterval(showMessage, 12000);

    return () => {
      window.clearTimeout(firstMessage);
      if (hideTimer) window.clearTimeout(hideTimer);
      if (pokeTimer.current) window.clearTimeout(pokeTimer.current);
      window.clearInterval(messageLoop);
    };
  }, []);

  const startDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    const walker = walkerRef.current;
    const track = trackRef.current;
    if (!walker || !track) return;

    const walkerBounds = walker.getBoundingClientRect();
    const creature = walker.querySelector<HTMLElement>(".creature");
    if (creature) {
      const transform = window.getComputedStyle(creature).transform;
      wasReturning.current =
        transform !== "none" && new DOMMatrixReadOnly(transform).a < 0;
    }
    dragOffset.current = {
      x: event.clientX - walkerBounds.left,
      y: event.clientY - walkerBounds.top,
    };
    dragStart.current = { x: event.clientX, y: event.clientY };
    didDrag.current = false;
    isDragging.current = true;
    walker.style.animation = "none";
    walker.style.removeProperty("--creature-delay");
    walker.style.position = "fixed";
    walker.style.left = `${walkerBounds.left}px`;
    walker.style.top = `${walkerBounds.top}px`;
    walker.style.bottom = "auto";
    walker.classList.add("is-dragging");
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragCreature = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const walker = walkerRef.current;
    if (!walker) return;

    if (
      Math.hypot(
        event.clientX - dragStart.current.x,
        event.clientY - dragStart.current.y,
      ) > 5
    ) {
      didDrag.current = true;
    }

    const x = Math.min(
      window.innerWidth - walker.offsetWidth,
      Math.max(0, event.clientX - dragOffset.current.x),
    );
    const top = Math.min(
      window.innerHeight - walker.offsetHeight,
      Math.max(0, event.clientY - dragOffset.current.y),
    );

    walker.style.left = `${x}px`;
    walker.style.top = `${top}px`;
  };

  const dropCreature = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const walker = walkerRef.current;
    const track = trackRef.current;
    if (!walker || !track) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    walker.classList.remove("is-dragging");
    walker.classList.add("is-dropping");
    walker.style.top = `${window.innerHeight - walker.offsetHeight}px`;

    window.setTimeout(() => {
      const trackBounds = track.getBoundingClientRect();
      const trackWidth = trackBounds.width;
      const start = Math.min(72, Math.max(0, trackWidth - 52));
      const end = Math.max(start + 1, trackWidth - 124);
      const viewportX = Number.parseFloat(walker.style.left) || trackBounds.left + start;
      const currentX = Math.min(end, Math.max(start, viewportX - trackBounds.left));
      const horizontalProgress = (currentX - start) / (end - start);
      const progress = wasReturning.current
        ? 1 - 0.48 * horizontalProgress
        : 0.48 * horizontalProgress;

      walker.classList.remove("is-dropping");
      walker.style.position = "";
      walker.style.left = "";
      walker.style.top = "";
      walker.style.bottom = "";
      walker.style.animation = "";
      walker.style.setProperty("--creature-delay", `${-progress * 26}s`);
    }, 1160);
  };

  return (
    <footer className="site-footer">
      <div className="footer-identity">
        <div className="footer-name">
          <img src="/logo-claudio.svg" alt="" width="32" height="32" />
          <span>Claudio Bakker</span>
        </div>
        <AmsterdamTime />
        <p className="footer-credit">Designed + coded by Claudio</p>
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

      <div ref={trackRef} className="creature-track">
        <div
          ref={walkerRef}
          className="creature-walker"
          role="img"
          aria-label="A small walking creature"
          onPointerDown={startDragging}
          onPointerMove={dragCreature}
          onPointerUp={dropCreature}
          onPointerCancel={dropCreature}
          onPointerEnter={greetVisitor}
          onPointerLeave={() => setHoverMessage(null)}
          onClick={pokeCreature}
        >
          <span
            className={`creature-message${pokeMessage || hoverMessage || creatureMessage ? " is-visible" : ""}`}
          >
            {pokeMessage || hoverMessage || creatureMessage}
          </span>
          <div className="creature">
            <span className="creature-body">
              <span className="creature-eye creature-eye-left" />
              <span className="creature-eye creature-eye-right" />
            </span>
            <span className="creature-leg creature-leg-one" />
            <span className="creature-leg creature-leg-two" />
          </div>
        </div>
      </div>
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
