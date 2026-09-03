import type { ReactNode } from "react";
import { NetstoneCaseStudyRoute } from "../../netstone-case-study";

export default function NetstoneProjectLayout({ children }: { children: ReactNode }) {
  return <NetstoneCaseStudyRoute>{children}</NetstoneCaseStudyRoute>;
}
