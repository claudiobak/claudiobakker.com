"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Footer } from "./footer";

const chapters = [
  { id: "overview", label: "1. Overview" },
  { id: "discovery", label: "2. Discovery" },
  { id: "exploration", label: "3. Exploration" },
  { id: "solution", label: "4. The Solution" },
  { id: "outcome", label: "5. Outcome" },
];

const relatedProjects = [
  { company: "Cyrrus", year: "2025", image: "/project-2-cover.jpg" },
  { company: "JamPoint", year: "2025", image: "/project-3-cover.jpg" },
];

function Visual({ label }: { label: string }) {
  return <div className="case-visual"><span>{label}</span></div>;
}

export function NetstoneCaseStudy({ children }: { children: ReactNode }) {
  return <Link className="project-trigger" href="/project/netstone" scroll={false}>{children}</Link>;
}

export function NetstoneCaseStudyRoute({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const full = pathname.endsWith("/full");

  return (
    <>
      {children}
      <NetstoneCaseStudyPage full={full} />
    </>
  );
}

function NetstoneCaseStudyPage({ full = false }: { full?: boolean }) {
  const router = useRouter();
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);
  const [isClosing, setIsClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);

  const closeModal = useCallback(() => {
    if (full || isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      router.push("/", { scroll: false });
    }, 280);
  }, [full, router]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (!full && scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (!full && event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeModal, full]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const revealItems = scroller.querySelectorAll<HTMLElement>([
      ".case-intro",
      ".case-meta",
      ".case-cover",
      ".case-section > h2",
      ".case-section > p",
      ".case-subsection > h3",
      ".case-subsection > h4",
      ".case-subsection > p",
      ".case-subsection > blockquote",
      ".case-visual",
      ".case-results",
      ".case-related > h2",
      ".case-related-card",
    ].join(","));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { root: scroller, rootMargin: "0px 0px -8%", threshold: 0.08 });

    revealItems.forEach((item) => {
      item.classList.add("case-reveal");
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const updateActiveChapter = () => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    let current = chapters[0].id;
    chapters.forEach(({ id }) => {
      const section = scroller.querySelector<HTMLElement>(`#${id}`);
      if (section && section.offsetTop <= scroller.scrollTop + 180) current = id;
    });
    setActiveChapter(current);
  };

  return (
        <div className={`case-overlay has-scroll-reveals${full ? " is-full-page" : ""}${isClosing ? " is-closing" : ""}`} role="presentation" onMouseDown={(event) => {
          if (!full && event.target === event.currentTarget) closeModal();
        }}>
          <section
            className={`case-modal${full ? " is-expanded" : ""}`}
            role={full ? undefined : "dialog"}
            aria-modal={full ? undefined : "true"}
            aria-labelledby="netstone-case-title"
          >
            {!full && <Link
              className="case-control case-expand"
              href="/project/netstone/full"
              scroll={false}
              aria-label="Open full case study"
            >
              <ExpandIcon />
            </Link>}
            {!full && <button className="case-control case-close" type="button" onClick={closeModal} aria-label="Close case study">
              <CloseIcon />
            </button>}

            <div ref={scrollRef} className="case-scroll" onScroll={updateActiveChapter}>
              <header className="case-header">
                <Link className="case-project-logo" href="/project/netstone" scroll={false} aria-label="Return to project modal">
                  <Image src="/logo-claudio.svg" alt="Claudio Bakker" width={57} height={56} unoptimized />
                </Link>
                <p><Link href="/">Work</Link><ChevronIcon /><strong>Netstone</strong></p>
              </header>

              <div className="case-layout">
                <nav className="case-chapters" aria-label="Case study chapters">
                  {chapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`} className={activeChapter === chapter.id ? "is-active" : undefined} onClick={() => setActiveChapter(chapter.id)}>{chapter.label}</a>)}
                </nav>

                <article className="case-content">
                  <div className="case-intro">
                    <Image src="/netstone-logo.svg" alt="Netstone" width={58} height={58} unoptimized />
                    <h1 id="netstone-case-title">Netstone Security Portal</h1>
                    <p>A client portal designed to make complex cybersecurity information easier to understand, prioritize and act on.</p>
                  </div>
                  <dl className="case-meta">
                    <div><dt>Year</dt><dd>2026</dd></div>
                    <div><dt>Team</dt><dd>Security specialists · Developer · Project lead</dd></div>
                    <div><dt>Role</dt><dd>Product Designer &amp; Front-end Developer</dd></div>
                    <div><dt>Skills</dt><dd>Research · UX/UI · Prototyping · Testing · AI UX</dd></div>
                  </dl>
                  <Image className="case-cover" src="/project-1-cover.jpg" alt="Netstone Security Portal" width={1356} height={736} sizes="(max-width: 900px) 100vw, 70vw" priority />

                  <CaseSection id="overview" number="1." title="Overview">
                    <p>Netstone provides managed cybersecurity services using specialized security platforms alongside its own expertise. As its services expanded, so did the number of systems involved in protecting client environments.</p>
                    <Sub title="1.1 Challenge"><p>Security information was spread across vendor platforms, reports, emails and conversations with Netstone specialists. While these tools worked well for security professionals, clients lacked a clear view of the bigger picture.</p><p>Netstone specialists also spent time translating technical findings and answering recurring questions about vulnerabilities and incidents.</p><p>The challenge wasn&apos;t a lack of information, but <strong>making it clear and useful to clients.</strong></p></Sub>
                    <Sub title="1.2 Opportunity"><p>Netstone saw an opportunity to create a single client-facing experience on top of its existing security stack, bringing relevant information together without replacing the specialist tools already in use.</p><p>The portal would complement Netstone&apos;s security tooling, not replace it.</p></Sub>
                    <Sub title="1.3 Highlights"><p>The Netstone Security Portal translates complex security information into a client experience built around priorities, ownership and understanding.</p><h4>Know what needs attention</h4><p>The dashboard brings security information from different systems into one clear overview, prioritizing what requires attention and what Netstone is already handling.</p><Visual label="Dashboard · Requires your attention · Netstone is handling" /><h4>Know who&apos;s handling it</h4><p>Actions and incidents make responsibility explicit, so clients can immediately see whether something requires their organization, is being handled by Netstone, or needs no action at all.</p><Visual label="Action · Incident · Responsibility states" /><h4>Understand with AI</h4><p>Netstone AI works across the portal, providing contextual explanations and summaries directly where questions occur.</p><Visual label="Vulnerability · Explain · AI drawer" /></Sub>
                  </CaseSection>

                  <CaseSection id="discovery" number="2." title="Discovery">
                    <p>Before designing the portal, I looked at how security information moved between Netstone, its tools and its clients, and what different users actually needed from it.</p>
                    <Sub title="2.1 Understanding the Users"><p>Security specialists relied on detections, evidence and technical context. IT administrators needed affected systems and remediation details, while decision-makers focused on risk, responsibility and progress.</p><p>The same questions kept coming up: Are we secure? What needs our attention? Is Netstone already handling it? What happens next?</p></Sub>
                    <Sub title="2.2 Key Insights"><p>The underlying platforms contained plenty of information, but were designed primarily for security professionals. Simply bringing all that data into one dashboard wouldn&apos;t necessarily help clients understand it.</p><p>The opportunity became less about centralizing security data and more about translating it into a clear client experience.</p><blockquote>Translate the complexity. Don&apos;t reproduce it.</blockquote></Sub>
                  </CaseSection>

                  <CaseSection id="exploration" number="3." title="Exploration">
                    <p>With the core needs defined, I explored how Netstone&apos;s security information could come together in a single client experience.</p>
                    <Sub title="3.1 Early Concepts"><p>I tested three ways of prioritizing the same information: metrics-first, incident-first and action-first. These explorations revealed which hierarchy best matched how clients used the service.</p><Visual label="Metrics-first · Incident-first · Action-first" /></Sub>
                    <Sub title="3.2 Testing & Iteration"><p>During testing, I asked users: What needs your attention right now? The answer wasn&apos;t immediately clear. Too many metrics competed for attention, while responsibility and next steps were easy to miss.</p><Visual label="Tested dashboard with annotations" /><p>Users also didn&apos;t naturally leave their current task to open the AI assistant. The AI wasn&apos;t the problem. Its place in the experience was.</p><Visual label="Early global Netstone AI concept" /></Sub>
                    <Sub title="3.3 Design Direction"><p>Testing defined three principles: prioritize what matters, make ownership explicit, and explain before exposing detail.</p><Visual label="Three design-principle cards" /></Sub>
                  </CaseSection>

                  <CaseSection id="solution" number="4." title="The Solution">
                    <p>I applied these principles across the portal&apos;s core workflows, from understanding what needs attention to following incidents and getting help.</p>
                    <Sub title="4.1 Clear Priorities"><p>The dashboard was redesigned around current security status, what required attention and what Netstone was already handling. Detailed metrics remained available without competing with urgent information.</p><Visual label="Final dashboard" /><p>Vendor severity models were translated into a shared Netstone assessment while preserving the original technical information.</p><Visual label="Vendor scores · Netstone assessment" /><p>The result: less time interpreting the dashboard, more clarity on what matters.</p></Sub>
                    <Sub title="4.2 Taking Action"><p>Actions communicate who is responsible, what needs to happen and when. Impact and recommended next steps appear before optional technical details.</p><Visual label="Actions and vulnerability details" /></Sub>
                    <Sub title="4.3 Incident Response"><p>Instead of exposing detections from multiple systems as separate alerts, the portal combines them into the incident Netstone is actually investigating.</p><Visual label="Multiple detections · One incident" /><p>Clients can see what happened, the impact, Netstone&apos;s response and whether anything is required from them. A clear timeline shows progress without raw security logs.</p><blockquote>Is Netstone already dealing with this?</blockquote></Sub>
                    <Sub title="4.4 AI Assistance"><p>Contextual actions such as Explain, Summarize and Why this action? bring Netstone AI into the workflow. Relevant context is attached automatically, while the global assistant remains available for broader questions.</p><Visual label="Global assistant · Contextual AI entry points" /><p>The AI shifted from a destination users had to seek out to assistance embedded within the workflow.</p></Sub>
                    <Sub title="4.5 Building Trust"><p>The interface distinguishes source data, Netstone&apos;s assessment and AI-generated explanations. AI responses also show the information they are based on.</p><Visual label="Source · Netstone · AI" /><p>This keeps the experience simple without hiding where information comes from.</p></Sub>
                  </CaseSection>

                  <CaseSection id="outcome" number="5." title="Outcome">
                    <p>The final portal creates one clear client experience on top of Netstone&apos;s existing security stack. Clients understand what matters, who&apos;s handling it and what happens next.</p>
                    <Sub title="5.1 Final Product"><p>The dashboard, actions, vulnerabilities, incidents and Netstone AI share one consistent information hierarchy. Clients can start with an overview and move deeper when needed.</p><Visual label="Final product walkthrough" /></Sub>
                    <Sub title="5.2 Results"><div className="case-results"><p><strong>−31%</strong><span>Status-related support requests</span></p><p><strong>38 → 14 sec</strong><span>Time to identify the highest-priority issue</span></p><p><strong>91%</strong><span>Correctly understood active incident status</span></p></div><Visual label="Results · Final product gallery" /></Sub>
                    <Sub title="5.3 Reflection"><p>The project reinforced that simplifying a complex product isn&apos;t about removing information. It&apos;s about deciding what users need to understand first.</p><p>Clear ownership proved as important as status. Technical depth became more useful on demand, and AI became more valuable when embedded where questions naturally occurred.</p></Sub>
                  </CaseSection>

                  <section className="case-related" aria-labelledby="case-related-title">
                    <h2 id="case-related-title">Also check out...</h2>
                    <div className="case-related-grid">
                      {relatedProjects.map((project) => (
                        <article className="case-related-card" key={project.company}>
                          <Image
                            src={project.image}
                            alt={`${project.company} project cover`}
                            width={678}
                            height={368}
                            sizes="(max-width: 900px) 100vw, 50vw"
                            unoptimized
                          />
                          <p>
                            <span>{project.company}</span>
                            <span> · {project.year}</span>
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                </article>
              </div>
              {full && <div className="case-full-footer"><Footer /></div>}
            </div>
          </section>
        </div>
  );
}

function CaseSection({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return <section id={id} className="case-section"><h2><span>{number}</span> {title}</h2><div className="case-rule" />{children}</section>;
}
function Sub({ title, children }: { title: string; children: ReactNode }) {
  return <section className="case-subsection"><h3>{title}</h3>{children}</section>;
}
function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4l5 5" />
      <path d="M4 4h5" />
      <path d="M4 4v5" />
      <path d="M20 20l-5-5" />
      <path d="M20 20h-5" />
      <path d="M20 20v-5" />
    </svg>
  );
}
function CloseIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>; }
function ChevronIcon() { return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>; }
