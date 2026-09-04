"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Footer } from "./footer";

const chapters = [
  { id: "overview", label: "1. Overview" },
  { id: "problem", label: "2. Understanding the Problem" },
  { id: "direction", label: "3. Finding the Direction" },
  { id: "design", label: "4. Designing & Testing" },
  { id: "platform", label: "5. The Platform" },
  { id: "building", label: "6. Building Jamtime" },
  { id: "outcome", label: "7. Outcome" },
];

const relatedProjects = [
  { company: "Netstone", year: "2026", image: "/project-1-cover.jpg", href: "/project/netstone" },
  { company: "Cyrrus", year: "2025", image: "/project-2-cover.jpg" },
];

function Visual({ label }: { label: string }) {
  return <div className="case-visual"><span>{label}</span></div>;
}

export function JamtimeCaseStudy({ children }: { children: ReactNode }) {
  const [openFullPage, setOpenFullPage] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 720px)");
    const updateDestination = () => setOpenFullPage(mediaQuery.matches);
    updateDestination();
    mediaQuery.addEventListener("change", updateDestination);
    return () => mediaQuery.removeEventListener("change", updateDestination);
  }, []);

  return <Link className="project-trigger project-trigger-jamtime" href={openFullPage ? "/project/jamtime/full" : "/project/jamtime"} scroll={false}>{children}</Link>;
}

export function JamtimeCaseStudyRoute({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <>{children}<JamtimeCaseStudyPage full={pathname.endsWith("/full")} /></>;
}

function JamtimeCaseStudyPage({ full }: { full: boolean }) {
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
    closeTimerRef.current = window.setTimeout(() => router.push("/", { scroll: false }), 280);
  }, [full, router]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (!full && scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
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
    const items = scroller.querySelectorAll<HTMLElement>([
      ".case-intro", ".case-meta", ".case-cover", ".case-section > h2", ".case-section > p",
      ".case-subsection > h3", ".case-subsection > h4", ".case-subsection > p",
      ".case-subsection > blockquote", ".case-visual", ".case-study-image", ".case-related > h2", ".case-related-card",
    ].join(","));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { root: scroller, rootMargin: "0px 0px -8%", threshold: 0.08 });
    items.forEach((item) => {
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
      <section className={`case-modal${full ? " is-expanded" : ""}`} role={full ? undefined : "dialog"} aria-modal={full ? undefined : "true"} aria-labelledby="jamtime-case-title">
        {!full && <Link className="case-control case-expand" href="/project/jamtime/full" scroll={false} aria-label="Open full case study"><ExpandIcon /></Link>}
        {!full && <button className="case-control case-close" type="button" onClick={closeModal} aria-label="Close case study"><CloseIcon /></button>}

        <div ref={scrollRef} className="case-scroll" onScroll={updateActiveChapter}>
          <header className="case-header">
            <Link className="case-project-logo" href="/project/jamtime" scroll={false} aria-label="Return to project modal">
              <Image src="/logo-claudio.svg" alt="Claudio Bakker" width={57} height={56} unoptimized />
            </Link>
            <p><Link href="/">Work</Link><ChevronIcon /><strong>Jamtime</strong></p>
          </header>

          <div className="case-layout">
            <nav className="case-chapters" aria-label="Case study chapters">
              {chapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`} className={activeChapter === chapter.id ? "is-active" : undefined} onClick={() => setActiveChapter(chapter.id)}>{chapter.label}</a>)}
            </nav>

            <article className="case-content">
              <div className="case-intro">
                <Image src="/jamtime-logo.svg" alt="Jamtime" width={58} height={58} unoptimized />
                <h1 id="jamtime-case-title">Jamtime</h1>
                <p>A social platform that helps musicians discover each other, connect and make music together.</p>
              </div>
              <dl className="case-meta">
                <div><dt>Client</dt><dd>Steve&apos;s Guitar School</dd></div>
                <div><dt>Role</dt><dd>Product Designer &amp; Front-end Developer</dd></div>
                <div><dt>Year</dt><dd>2024–2026</dd></div>
                <div><dt>Scope</dt><dd>UX Research · Product Design · Prototyping · Front-end Development</dd></div>
              </dl>
              <Image className="case-cover" src="/project-3-cover.jpg" alt="Jamtime platform" width={1356} height={736} sizes="(max-width: 900px) 100vw, 70vw" priority unoptimized />

              <CaseSection id="overview" number="1." title="Overview">
                <p>Jamtime is a social platform built specifically for musicians looking to connect with other people to play with.</p>
                <p>What started as a concept for a digital musician bulletin board evolved into a complete platform combining <strong>musician discovery, profiles, posts, advertisements and messaging</strong> in one experience.</p>
                <Sub title="1.1 Challenge"><p>Musicians already use social media, forums and musician-specific platforms to find people to play with. The problem is that these experiences often provide limited ways to determine whether someone is actually a good fit.</p><p>Instrument, genre, location, experience and musical interests can all influence whether two musicians want to play together.</p><p>The challenge was to make finding and approaching potential collaborators <strong>more relevant, trustworthy and approachable.</strong></p></Sub>
                <Sub title="1.2 Opportunity"><p>Rather than creating another listing website, Jamtime could provide a space built around a musician&apos;s identity and the process of connecting with others.</p><p>The goal was to bring <strong>discovery, social interaction and communication</strong> together so musicians could go from finding someone interesting to starting a conversation without relying on several different platforms.</p></Sub>
                <Sub title="1.3 Highlights"><h4>Discover musicians that fit</h4><p>Search, filters and personalized feeds help users discover musicians based on factors such as instrument, genre, location and experience.</p><Visual label="Video · Homepage, filters and musician profile" /><h4>Build your musical identity</h4><p>Profiles bring together instruments, genres, experience, personal information and media so musicians can understand who they&apos;re connecting with.</p><Visual label="Video · Musician profile, instruments, genres and media" /><h4>From discovery to conversation</h4><p>Posts, advertisements and messaging let musicians discover opportunities and contact each other within the same platform.</p><Visual label="Video · Advertisement, profile, message and conversation" /></Sub>
              </CaseSection>

              <CaseSection id="problem" number="2." title="Understanding the Problem">
                <p>Before designing Jamtime, I researched how musicians currently find people to play with and what influences their decision to contact someone.</p>
                <Sub title="2.1 User Research"><p>I conducted a survey with <strong>45 musicians</strong> to identify broader patterns, followed by <strong>12 interviews</strong> with students, band members and experienced musicians.</p><p>The research explored how musicians currently find collaborators, what information they consider important and what prevents them from approaching someone they don&apos;t know.</p><div className="case-visual case-visual-image"><Image className="case-study-image" src="/jamtime-user-research.png" alt="Six Jamtime research participants: Maya, Jordan, Emma, Alex, Nina and Daniel" width={561} height={443} sizes="(max-width: 720px) 75vw, 480px" unoptimized /></div></Sub>
                <Sub title="2.2 The Current Journey"><p>The research showed that finding someone often involved several disconnected steps.</p><p>Musicians might discover someone through a post or social platform, search elsewhere for examples of their music and then use another application to contact them.</p><div className="case-visual case-visual-document"><Image src="/jamtime-user-journey.webp" alt="Jamtime user journey map showing the stages from orientation to evaluation" width={1047} height={444} sizes="(max-width: 900px) 100vw, 820px" unoptimized /></div><p>The experience wasn&apos;t necessarily difficult because musicians were impossible to find. The bigger challenge was determining <strong>who might actually be a good fit.</strong></p></Sub>
                <Sub title="2.3 Key Insights"><p>Three findings became particularly important.</p><h4>Trust &amp; confidence</h4><p>Before contacting someone, musicians wanted enough information to understand who they were and what they played.</p><h4>Musical compatibility</h4><p>Instrument alone wasn&apos;t enough. Genre, location, experience, influences and goals could all determine whether someone felt relevant.</p><h4>Fragmented interaction</h4><p>Discovery, sharing music and communication frequently happened across different platforms.</p><blockquote>A good match goes beyond playing the right instrument.</blockquote></Sub>
              </CaseSection>

              <CaseSection id="direction" number="3." title="Finding the Direction">
                <p>The research showed an opportunity for a more focused experience, but there were several ways the product could approach the problem.</p>
                <Sub title="3.1 Concept Directions"><p>I explored three directions.</p><h4>Digital Bulletin Board</h4><p>A straightforward platform for posting and responding to musician advertisements.</p><h4>Musician Network</h4><p>A social platform built around profiles, content and ongoing connections.</p><h4>Matchmaking</h4><p>A guided experience that recommends musicians based on shared preferences and goals.</p><div className="case-visual case-visual-document"><Image src="/jamtime-concepts.png" alt="Three Jamtime concepts: a digital bulletin board, network platform and matchmaking app" width={1621} height={1080} sizes="(max-width: 720px) 100vw, 880px" unoptimized /></div></Sub>
                <Sub title="3.2 Choosing a Direction"><p>Co-creation sessions and a follow-up survey showed the strongest preference for the <strong>Digital Bulletin Board</strong>.</p><p>The concept was immediately understandable. Someone looking for a guitarist, drummer, vocalist or band could post what they needed and interested musicians could respond.</p><Visual label="Concept survey · Digital Bulletin Board highlighted" /><p>This became the starting point rather than the final definition of the product.</p><p>As the concept was tested and developed further, it became clear that musicians also wanted ways to discover people outside active advertisements, follow interesting musicians and interact socially.</p></Sub>
                <Sub title="3.3 Structuring the Experience"><p>The initial information architecture and user flows were built around a simple journey: <strong>Discover → Evaluate → Connect</strong>.</p><p>That journey became the foundation for the wider platform.</p><Visual label="User flow · Discover → Profile/Post → Connect → Message" /></Sub>
              </CaseSection>

              <CaseSection id="design" number="4." title="Designing & Testing">
                <p>I translated the concept into sketches and low-fidelity prototypes before developing the final interface.</p>
                <Sub title="4.1 Early Concepts"><p>The first designs focused primarily on musician advertisements, discovery, profiles and communication.</p><Visual label="Early sketches · Discovery · Advertisement · Profile · Messaging" /><p>These screens allowed the core journey to be tested without committing to the complete feature set or visual direction.</p></Sub>
                <Sub title="4.2 Testing & Iteration"><p>Two rounds of usability testing revealed that users expected more flexibility than the original bulletin-board model provided.</p><p>Musicians wanted to browse the platform without immediately creating an account, discover people outside advertisements and keep track of musicians or posts they found interesting.</p><p>They also wanted more control over communication and clearer separation between content and posts specifically looking for collaborators.</p><Visual label="Low-fidelity prototype with testing annotations" /><p>These findings expanded the product beyond its original concept.</p></Sub>
                <Sub title="4.3 Design Direction"><p>Testing established three principles for the next iteration.</p><h4>Make discovery flexible</h4><p>Musicians should be discoverable through people, posts, filters and feeds rather than one search method.</p><h4>Give profiles enough context</h4><p>Users should be able to understand someone&apos;s musical identity before contacting them.</p><h4>Keep connection low pressure</h4><p>Following, saving and message requests should allow musicians to show interest without immediately starting a conversation.</p><p>These principles shaped the final platform.</p></Sub>
              </CaseSection>

              <CaseSection id="platform" number="5." title="The Platform">
                <p>The final Jamtime experience combines the original musician-listing concept with the social features needed to support discovery and ongoing connections.</p>
                <Sub title="5.1 Discover"><p>The homepage acts as the main discovery layer of Jamtime.</p><p>Users can browse posts and discover musicians through filters including <strong>genre, age, location, instrument and experience level</strong>.</p><Visual label="Homepage with feed and discovery controls" /><p>Feed options allow users to move between new content, musicians they follow and relevant activity nearby.</p><Visual label="Homepage feed controls" /><p>This makes discovery possible even when a user isn&apos;t actively searching for a specific band member.</p></Sub>
                <Sub title="5.2 Profiles"><p>Every musician has a profile built around their musical identity.</p><p>Profiles combine personal information with instruments, genres, experience, media and other details that help someone determine whether they might be compatible.</p><Visual label="Full musician profile" /><p>Users can follow musicians they&apos;re interested in and return to their activity without having to immediately contact them.</p><Visual label="Profile header · Follow and Message" /></Sub>
                <Sub title="5.3 Posts & Ads"><p>Jamtime supports two distinct forms of publishing.</p><p><strong>Ads</strong> are specifically for finding musicians, bands or other collaboration opportunities.</p><p><strong>Posts</strong> are used to share music, updates and content with the wider community.</p><Visual label="Post and advertisement side by side" /><p>Posts support social interactions such as <strong>likes, comments and saves</strong>, while advertisements provide the information someone needs to evaluate and respond to an opportunity.</p><Visual label="Post interactions" /><p>Separating the two prevents collaboration requests from becoming indistinguishable from regular social content.</p></Sub>
                <Sub title="5.4 Search & Filtering"><p>Search extends beyond simply looking up usernames.</p><p>Musicians can narrow discovery using criteria relevant to playing together, including <strong>instrument, genre, age, location and experience</strong>.</p><Visual label="Search and discovery screen with filters open" /><p>This turns the research around musical compatibility into a functional part of the product rather than relying entirely on browsing.</p></Sub>
                <Sub title="5.5 Messaging"><p>When users decide to contact someone, the conversation stays inside Jamtime.</p><p>Messaging separates conversations into <strong>Primary, Groups and Requests</strong>, helping users manage both existing connections and people contacting them for the first time.</p><Visual label="Full messaging interface" /><p>New conversations can arrive as requests that users can accept or ignore.</p><Visual label="Message request" /><p>Replies are linked to their original messages, making longer conversations easier to follow.</p><Visual label="Reply interaction" /></Sub>
                <Sub title="5.6 Browsing Before Joining"><p>Jamtime can be explored without creating an account.</p><p>Visitors can browse musicians, profiles and opportunities before signing up. An account is only required once they want to interact, such as responding to an advertisement or contacting another musician.</p><Visual label="Browse → Profile/Ad → Interact → Sign-up" /><p>This lets new users understand what the community offers before being asked to register.</p></Sub>
              </CaseSection>

              <CaseSection id="building" number="6." title="Building Jamtime">
                <p>Jamtime continued beyond the high-fidelity prototype into a working web platform.</p>
                <p>I translated the product design into a responsive application using <strong>Next.js, TypeScript, Tailwind CSS and Supabase</strong>, connecting the interface to real user accounts, content and interactions.</p>
                <Visual label="Final desktop and mobile screens side by side" />
                <p>Building the product also meant designing for states that weren&apos;t always visible in the original prototype, including empty states, loading states, authentication, content creation, message requests and responsive behavior.</p>
                <p>Moving between design and development allowed these details to be refined directly in the working product rather than treating the Figma prototype as the final outcome.</p>
              </CaseSection>

              <CaseSection id="outcome" number="7." title="Outcome">
                <p>Jamtime evolved considerably from the original digital bulletin-board concept.</p>
                <p>What started as a way to post and respond to musician advertisements became a broader social platform where musicians can <strong>discover people, present their musical identity, share content, find opportunities and communicate.</strong></p>
                <Sub title="7.1 Final Product"><p>The final platform connects the entire journey from discovering another musician to starting a conversation.</p><Visual label="Final product · Home → Filter → Profile → Follow → Advertisement → Message" /><p>Rather than replacing the ways musicians naturally form connections, Jamtime gives those interactions a space designed specifically around making music together.</p></Sub>
                <Sub title="7.2 Reflection"><p>The biggest lesson from Jamtime was that the original problem was broader than search.</p><p>Finding someone who plays guitar or drums is relatively straightforward. Deciding whether you actually want to play together requires much more context.</p><p>That insight changed both the design and scope of the product. Profiles became richer, discovery became more flexible and social interactions became part of the experience.</p><p>Taking Jamtime from <strong>research and prototypes into a working product</strong> also changed how I approached the design. Decisions had to work beyond a single ideal user flow and account for real content, different screen sizes, system states and ongoing interaction.</p></Sub>
              </CaseSection>

              <section className="case-related" aria-labelledby="jamtime-related-title">
                <h2 id="jamtime-related-title">Also check out...</h2>
                <div className="case-related-grid">
                  {relatedProjects.map((project) => {
                    const card = <><Image src={project.image} alt={`${project.company} project cover`} width={678} height={368} sizes="(max-width: 900px) 100vw, 50vw" unoptimized /><p><span>{project.company}</span><span> · {project.year}</span></p></>;
                    return project.href ? <Link className="case-related-card" href={project.href} scroll={false} key={project.company}>{card}</Link> : <article className="case-related-card" key={project.company}>{card}</article>;
                  })}
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
function ExpandIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4l5 5" /><path d="M4 4h5" /><path d="M4 4v5" /><path d="M20 20l-5-5" /><path d="M20 20h-5" /><path d="M20 20v-5" /></svg>; }
function CloseIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>; }
function ChevronIcon() { return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>; }
