import type { ReactNode } from "react";
import { JamtimeCaseStudyRoute } from "../../jamtime-case-study";

export default function JamtimeProjectLayout({ children }: { children: ReactNode }) {
  return <JamtimeCaseStudyRoute>{children}</JamtimeCaseStudyRoute>;
}
