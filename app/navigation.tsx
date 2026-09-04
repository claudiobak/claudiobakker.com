"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Work", href: "/" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/Claudio_Bakker_CV.pdf" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const activeIndex = Math.max(
    links.findIndex(({ href }) =>
      href === "/" ? pathname === href : pathname.startsWith(href),
    ),
    0,
  );

  return (
    <div className="navigation-shell">
      <button
        type="button"
        className={`menu-toggle${isOpen ? " is-open" : ""}`}
        aria-expanded={isOpen}
        aria-controls="main-navigation"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span />
        <span />
      </button>
      <nav
        id="main-navigation"
        className={`navigation${isOpen ? " is-open" : ""}`}
        aria-label="Main navigation"
      >
        <span
          className="navigation-indicator"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
          aria-hidden="true"
        />
        {links.map(({ label, href }, index) => (
          <Link
            key={href}
            href={href}
            className="navigation-link"
            aria-current={index === activeIndex ? "page" : undefined}
            target={label === "Resume" ? "_blank" : undefined}
            rel={label === "Resume" ? "noopener noreferrer" : undefined}
            prefetch={label === "Resume" ? false : undefined}
            onClick={() => setIsOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
