import type { Metadata } from "next";
import { NetstoneCaseStudyPage } from "../../../netstone-case-study";

export const metadata: Metadata = {
  title: "Netstone Security Portal | Claudio Bakker",
};

export default function FullNetstoneProjectPage() {
  return <NetstoneCaseStudyPage full />;
}
