import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { CustomCursor } from "./custom-cursor";
import { Footer } from "./footer";
import { Navigation } from "./navigation";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const metadata: Metadata = {
  title: "Claudio Bakker | Product Designer + Developer",
  description: "The portfolio of Claudio Bakker, a product designer who codes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <CustomCursor />
        <div className="site-shell">
          <header className="site-header">
            <Link href="/" className="logo-link" aria-label="Claudio Bakker — home">
              <Image
                src="/logo-claudio.svg"
                alt=""
                width={57}
                height={56}
                priority
                unoptimized
              />
            </Link>
            <Navigation />
          </header>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
