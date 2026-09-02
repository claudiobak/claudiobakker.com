import Image from "next/image";
import { AboutSectionNav } from "../about-section-nav";

const freelanceClients = [
  { name: "Netstone", logo: "/netstone-logo.svg" },
  { name: "Cyrrus", logo: "/cyrrus-logo.svg" },
  { name: "Overweb", logo: "/overweb-logo.svg" },
];

const roles = [
  { company: "Concept7", title: "UX/UI designer (Intern)", year: "2024", logo: "/concept7-logo.svg" },
  { company: "De Voorhoede", title: "Front-end developer (Intern)", year: "2023", logo: "/devoorhoede-logo.svg" },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="hero about-hero" aria-labelledby="about-title">
        <h1 id="about-title">
          I’m Claudio, a product
          <br className="hero-title-break" />
          designer who codes.
        </h1>
        <p className="about-intro">
          Product designer, UX/UI designer, Front-end developer &amp;
          <br className="about-intro-break" /> everything in between.
        </p>
      </section>

      <div className="about-divider" />
      <div className="about-layout">
        <AboutSectionNav />

        <section className="about-section about-hello">
          <div className="about-portrait">
            <Image src="/portrait-claudio.jpg" alt="Claudio Bakker at the Louvre" width={272} height={350} sizes="(max-width: 720px) 70vw, 272px" unoptimized />
          </div>
          <div id="hello" className="about-copy">
            <h2>A little more about me</h2>
            <div className="about-details">
              <p>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 1.75A8.25 8.25 0 0 0 3.75 10c0 5.44 7.42 11.84 7.74 12.11a.8.8 0 0 0 1.02 0c.32-.27 7.74-6.67 7.74-12.11A8.25 8.25 0 0 0 12 1.75Zm0 5.5A2.75 2.75 0 1 0 12 12.75 2.75 2.75 0 0 0 12 7.25Z" />
                </svg>
                <span>Amsterdam</span>
              </p>
              <p>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M1.5 8.5 12 3l10.5 5.5L12 14 1.5 8.5ZM5.5 12v4.7c3.7 2.65 9.3 2.65 13 0V12L12 15.4 5.5 12ZM20.5 9H22v6.5h-1.5z" />
                </svg>
                <span>BSc Communication &amp; Multimedia Design, AUAS</span>
              </p>
            </div>
            <div className="about-prose">
              <p>I’ve always liked making things that sit somewhere between design and technology. I’m drawn to products that feel simple, but have a lot of thought behind them, especially tools that help people create, connect or get things done easier.</p>
              <p>I tend to bounce between Figma and code, and I enjoy the whole process: understanding the problem, shaping an idea and turning it into something real.</p>
              <p>Outside of design, I’m usually making music, taking photos, building side projects or disappearing down a rabbit hole about something completely unrelated.</p>
              <p>Three words to describe me: curious, creative, and one idea away from a new project.</p>
            </div>
            <a className="about-contact" href="mailto:claudiobakker@gmail.com">
              <span className="about-contact-mark" aria-hidden="true" />
              <span>Building something exciting? <strong>Let’s talk!</strong></span>
            </a>
          </div>
        </section>

        <div className="about-section-divider about-section-divider-middle" />

        <section className="about-section about-experience">
          <h2 className="about-section-title">Experience</h2>
          <div id="experience" className="experience-content">
            <h3>Freelance Designer &amp; Developer<span>, 2024 – Present</span></h3>
            <div className="client-list">
              {freelanceClients.map((client) => (
                <div className="client" key={client.name}>
                  <span className="company-logo"><img src={client.logo} alt="" /></span>
                  <span>{client.name}</span>
                </div>
              ))}
            </div>
            <div className="role-list">
              {roles.map((role) => (
                <div className="role" key={role.company}>
                  <span className="company-logo"><img src={role.logo} alt="" /></span>
                  <div>
                    <h4>{role.company}</h4>
                    <p>{role.title}, <span>{role.year}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="about-section-divider about-section-divider-bottom" />
      </div>
    </main>
  );
}
