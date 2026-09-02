"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hello", label: "About me" },
  { id: "experience", label: "Experience" },
];

export function AboutSectionNav() {
  const [activeSection, setActiveSection] = useState("hello");

  useEffect(() => {
    const updateActiveSection = () => {
      const atPageBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4;

      if (atPageBottom) {
        setActiveSection(sections.at(-1)?.id ?? "hello");
        return;
      }

      const activationLine = window.innerHeight * 0.35;
      let current = sections[0].id;

      sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= activationLine) {
          current = id;
        }
      });

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <nav className="about-section-nav" aria-label="About sections">
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={activeSection === id ? "is-active" : undefined}
          aria-current={activeSection === id ? "location" : undefined}
          onClick={() => setActiveSection(id)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
