import Image from "next/image";
import { NetstoneCaseStudy } from "./netstone-case-study";

const projects = [
  {
    company: "Netstone",
    year: "2026",
    image: "/project-1-cover.jpg",
    description: "Making cybersecurity data clear and actionable.",
  },
  {
    company: "Cyrrus",
    year: "2025",
    image: "/project-2-cover.jpg",
    description: "Making complex workflows feel simple and intuitive.",
  },
  {
    company: "JamPoint",
    year: "2025",
    image: "/project-3-cover.jpg",
    description: "Helping musicians connect and create together.",
  },
  {
    company: "Onix",
    year: "2024",
    image: "/project-4-cover.jpg",
    description: "Making every digital interaction feel clear.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">
          I’m Claudio, a product
          <br className="hero-title-break" />
          designer who codes.
        </h1>
        <div className="hero-copy">
          <div className="intro-copy">
            <p className="copy-text">Designing products that turn interaction into experience.</p>
            <p>
              <span className="copy-text">
                Clients include{" "}
                <a href="https://netstone.nl/" target="_blank" rel="noreferrer">
                  <strong>Netstone</strong>
                </a>{" "}
                &amp; <strong>Cyrrus</strong>. Previously at{" "}
                <a href="https://concept7.nl/" target="_blank" rel="noreferrer">
                  <strong>Concept7</strong>
                </a>{" "}
                &amp;{" "}
                <a
                  href="https://www.voorhoede.nl/nl/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>De Voorhoede</strong>
                </a>.{" "}
              </span>
              <span className="contact-cta">
                <span className="contact-mark" aria-hidden="true">
                  <span className="contact-halo" />
                  <span className="contact-dot" />
                </span>
                <span className="contact-label">
                  Building something exciting?{" "}
                  <a href="mailto:claudiobakker@gmail.com" className="contact-link">
                    <strong>Let’s talk!</strong>
                  </a>
                </span>
              </span>
            </p>
          </div>
        </div>
      </section>
      <section className="projects" aria-label="Selected work">
        <div className="project-grid">
          {projects.map((project, index) => (
            index === 0 ? <NetstoneCaseStudy key={project.company}><article className="project-card">
              <div className="project-cover">
                <Image
                  src={project.image}
                  alt={`${project.company} project cover`}
                  width={678}
                  height={368}
                  sizes="(max-width: 720px) 100vw, 50vw"
                  priority={index === 0}
                  unoptimized
                />
                <p className="project-label">
                  <span>{project.company}</span>
                  <span className="project-meta"> • {project.year}</span>
                </p>
              </div>
              <p className="project-description">{project.description}</p>
            </article></NetstoneCaseStudy> : <article className="project-card" key={project.company}>
              <div className="project-cover"><Image src={project.image} alt={`${project.company} project cover`} width={678} height={368} sizes="(max-width: 720px) 100vw, 50vw" unoptimized /><p className="project-label"><span>{project.company}</span><span className="project-meta"> · {project.year}</span></p></div><p className="project-description">{project.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
