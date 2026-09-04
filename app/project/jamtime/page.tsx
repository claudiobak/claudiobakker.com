import type { Metadata } from "next";
import Home from "../../page";

export const metadata: Metadata = { title: "Jamtime | Claudio Bakker" };

export default function JamtimeProjectPage() {
  return <div className="case-background case-background-jamtime"><Home /></div>;
}
