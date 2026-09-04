import type { Metadata } from "next";
import Home from "../../page";

export const metadata: Metadata = {
  title: "Netstone Security Portal | Claudio Bakker",
};

export default function NetstoneProjectPage() {
  return <div className="case-background case-background-netstone"><Home /></div>;
}
