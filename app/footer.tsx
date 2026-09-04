"use client";

import Link from "next/link";
import Image from "next/image";
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
  const [message, setMessage] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isPointerDown = useRef(false);
  const isDragging = useRef(false);
  const wasReturning = useRef(false);
  const lastGreeting = useRef(-1);
  const dragStart = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);
  const messageTimer = useRef<number | undefined>(undefined);
  const pokeInFlight = useRef(false);
  const messageMode = useRef<"idle" | "hover" | "poke" | "drop">("idle");
  const hasShownPokeCount = useRef(false);
  const lastPokeReaction = useRef(-1);
  const pokeReactionQueue = useRef<number[]>([]);
  const lastDropReaction = useRef(-1);
  const dropReactionQueue = useRef<number[]>([]);

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

  const greetVisitor = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (messageMode.current !== "idle" && messageMode.current !== "hover") {
      return;
    }

    const greetings = ["oh hey!", "hello there!", "you found me!", "hi!"];
    let nextGreeting = Math.floor(Math.random() * greetings.length);

    if (nextGreeting === lastGreeting.current) {
      nextGreeting = (nextGreeting + 1) % greetings.length;
    }

    lastGreeting.current = nextGreeting;
    messageMode.current = "hover";
    if (messageTimer.current) window.clearTimeout(messageTimer.current);
    setMessage(greetings[nextGreeting]);
  };

  const stopGreeting = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (messageMode.current !== "hover") return;
    messageMode.current = "idle";
    setMessage(null);
  };

  const pokeCreature = async () => {
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }
    if (pokeInFlight.current) return;

    pokeInFlight.current = true;
    messageMode.current = "poke";
    if (messageTimer.current) window.clearTimeout(messageTimer.current);

    const storedCount = Number.parseInt(
      window.localStorage.getItem("creature-poke-count") ?? "0",
      10,
    );
    const fallbackCount = Number.isNaN(storedCount) ? 1 : storedCount + 1;

    const showPokeResult = (count: number) => {
      if (!hasShownPokeCount.current) {
        hasShownPokeCount.current = true;
        setMessage(`this is the ${ordinal(count)} time I've been poked :(`);
        return;
      }

      const reactions = [
        "again?",
        "enough.",
        "stop that.",
        "rude.",
        "ow! stop.",
        "ow.",
        "hey!",
        "was that necessary?",
        "personal space?",
        "I felt that.",
        "not again.",
        "seriously?",
        "I'm trying to walk here.",
        "you're enjoying this, aren't you?",
        "Claudio, help.",
        "one more time...",
        "excuse me?",
        "please don't.",
        "what did I do?",
        "can I help you?",
        "that tickles.",
        "we need to talk.",
        "I have feelings, you know.",
        "okay, that's enough.",
        "my lawyer will hear about this.",
        "reported.",
      ];
      if (pokeReactionQueue.current.length === 0) {
        const queue = reactions.map((_, index) => index);
        for (let index = queue.length - 1; index > 0; index -= 1) {
          const randomIndex = Math.floor(Math.random() * (index + 1));
          [queue[index], queue[randomIndex]] = [queue[randomIndex], queue[index]];
        }

        if (
          queue.length > 1 &&
          queue[queue.length - 1] === lastPokeReaction.current
        ) {
          [queue[0], queue[queue.length - 1]] = [
            queue[queue.length - 1],
            queue[0],
          ];
        }
        pokeReactionQueue.current = queue;
      }

      const nextReaction = pokeReactionQueue.current.pop() ?? 0;
      lastPokeReaction.current = nextReaction;
      setMessage(reactions[nextReaction]);
    };

    try {
      const response = await fetch("/api/poke", {
        method: "POST",
        signal: AbortSignal.timeout(4000),
      });
      if (!response.ok) throw new Error("Global counter unavailable");

      const data = (await response.json()) as { count?: number };
      if (typeof data.count !== "number") throw new Error("Invalid counter");

      window.localStorage.setItem("creature-poke-count", String(data.count));
      showPokeResult(data.count);
    } catch {
      window.localStorage.setItem("creature-poke-count", String(fallbackCount));
      showPokeResult(fallbackCount);
    } finally {
      pokeInFlight.current = false;
      messageTimer.current = window.setTimeout(() => {
        messageMode.current = "idle";
        setMessage(null);
      }, 3200);
    }
  };

  useEffect(() => {
    const messages = [
      "just passing through.",
      "don't mind me.",
      "where was I?",
      "taking the scenic route.",
      "this counts as cardio.",
      "wonder what's over there.",
      "another lap, then.",
      "nice portfolio.",
      "back and forth…",
      "got places to be.",
      "what a long page.",
      "still going.",
      "left, right, left…",
      "I like it here.",
    ];
    let messageIndex = 0;
    const showMessage = () => {
      if (messageMode.current !== "idle" || isPointerDown.current) return;

      setMessage(messages[messageIndex % messages.length]);
      messageIndex += 1;
      if (messageTimer.current) window.clearTimeout(messageTimer.current);
      messageTimer.current = window.setTimeout(() => setMessage(null), 2400);
    };

    const firstMessage = window.setTimeout(showMessage, 3000);
    const messageLoop = window.setInterval(showMessage, 12000);

    return () => {
      window.clearTimeout(firstMessage);
      if (messageTimer.current) window.clearTimeout(messageTimer.current);
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
    isPointerDown.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const dragCreature = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;
    const walker = walkerRef.current;
    if (!walker) return;

    const moved =
      Math.hypot(
        event.clientX - dragStart.current.x,
        event.clientY - dragStart.current.y,
      ) > 5;

    if (moved && !isDragging.current) {
      const walkerBounds = walker.getBoundingClientRect();
      didDrag.current = true;
      isDragging.current = true;
      walker.style.animation = "none";
      walker.style.removeProperty("--creature-delay");
      walker.style.position = "fixed";
      walker.style.left = `${walkerBounds.left}px`;
      walker.style.top = `${walkerBounds.top}px`;
      walker.style.bottom = "auto";
      walker.classList.add("is-dragging");
    }

    if (!isDragging.current) return;

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
    if (!isPointerDown.current) return;
    isPointerDown.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!isDragging.current) return;
    isDragging.current = false;

    const walker = walkerRef.current;
    const track = trackRef.current;
    if (!walker || !track) return;

    walker.classList.remove("is-dragging");
    walker.classList.add("is-dropping");
    const trackBounds = track.getBoundingClientRect();
    walker.style.top = `${trackBounds.bottom - walker.offsetHeight}px`;

    window.setTimeout(() => {
      const settledTrackBounds = track.getBoundingClientRect();
      const trackWidth = settledTrackBounds.width;
      const isVerySmallScreen = window.matchMedia("(max-width: 480px)").matches;
      const sideInset = isVerySmallScreen ? 8 : 72;
      const start = Math.min(
        sideInset,
        Math.max(0, trackWidth - walker.offsetWidth - 4),
      );
      const end = Math.max(
        start + 1,
        trackWidth - walker.offsetWidth - sideInset,
      );
      const viewportX =
        Number.parseFloat(walker.style.left) || settledTrackBounds.left + start;
      const currentX = Math.min(
        end,
        Math.max(start, viewportX - settledTrackBounds.left),
      );
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
      const travelDuration = window.matchMedia("(max-width: 480px)").matches
        ? 12
        : window.matchMedia("(max-width: 720px)").matches
          ? 18
          : 26;
      walker.style.setProperty(
        "--creature-delay",
        `${-progress * travelDuration}s`,
      );

      const reactions = [
        "big world, huh?",
        "phew.",
        "okay, okay.",
        "thanks, I guess.",
        "back to it.",
        "gravity wins again.",
        "nailed the landing.",
        "I meant to do that.",
        "where am I?",
        "well, that happened.",
        "back on my feet.",
        "you could've put me down gently.",
        "solid ground.",
        "what a trip.",
        "everything still attached?",
        "I can walk from here.",
        "weee—oh.",
        "that was actually kind of fun.",
      ];
      if (dropReactionQueue.current.length === 0) {
        const queue = reactions.map((_, index) => index);
        for (let index = queue.length - 1; index > 0; index -= 1) {
          const randomIndex = Math.floor(Math.random() * (index + 1));
          [queue[index], queue[randomIndex]] = [queue[randomIndex], queue[index]];
        }

        if (
          queue.length > 1 &&
          queue[queue.length - 1] === lastDropReaction.current
        ) {
          [queue[0], queue[queue.length - 1]] = [
            queue[queue.length - 1],
            queue[0],
          ];
        }
        dropReactionQueue.current = queue;
      }

      const nextReaction = dropReactionQueue.current.pop() ?? 0;
      lastDropReaction.current = nextReaction;
      messageMode.current = "drop";
      if (messageTimer.current) window.clearTimeout(messageTimer.current);
      setMessage(reactions[nextReaction]);
      messageTimer.current = window.setTimeout(() => {
        messageMode.current = "idle";
        setMessage(null);
      }, 2400);
    }, 1160);
  };

  return (
    <footer className="site-footer">
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
          onPointerLeave={stopGreeting}
          onClick={pokeCreature}
        >
          <span
            className={`creature-message${message ? " is-visible" : ""}`}
          >
            {message}
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

      <div className="footer-content">
        <div className="footer-identity">
          <div className="footer-name">
            <Image
              src="/logo-claudio.svg"
              alt=""
              width={32}
              height={32}
              unoptimized
            />
            <span>Claudio Bakker</span>
          </div>
          <AmsterdamTime />
          <p className="footer-credit">Designed + coded by Claudio</p>
        </div>

        <nav className="footer-navigation" aria-label="Footer navigation">
          <Link href="/">Work</Link>
          <Link href="/about">About</Link>
          <a
            href="/Claudio_Bakker_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
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
