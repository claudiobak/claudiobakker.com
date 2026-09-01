"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Work", href: "/" },
  { label: "Art", href: "/art" },
  { label: "About", href: "/about" },
];

export function Navigation() {
  const pathname = usePathname();
  const activeIndex = Math.max(
    links.findIndex(({ href }) =>
      href === "/" ? pathname === href : pathname.startsWith(href),
    ),
    0,
  );

  return (
    <nav className="navigation" aria-label="Main navigation">
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
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
