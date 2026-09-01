export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">
          I’m Claudio, a product
          <br />
          designer who codes.
        </h1>
        <div className="hero-copy">
          <div className="intro-copy">
            <p className="copy-text">Designing products that turn interaction into experience.</p>
            <p>
              <span className="copy-text">
                Clients include <strong>Netstone</strong>, <strong>Cyrrus</strong> &amp;{" "}
                <strong>Onix</strong>. Previously at <strong>Concept7</strong> &amp;{" "}
                <strong>De Voorhoede</strong>.{" "}
              </span>
              <span className="contact-cta" tabIndex={0} role="button">
                <span className="contact-mark" aria-hidden="true">
                  <span className="contact-halo" />
                  <span className="contact-dot" />
                </span>
                <span className="contact-label">
                  Working on something cool? Get in touch!
                </span>
              </span>
            </p>
          </div>
        </div>
      </section>
      <section className="projects" aria-labelledby="projects-title">
        <h2 id="projects-title">Selected work</h2>
        <p>Projects coming soon.</p>
      </section>
    </main>
  );
}
