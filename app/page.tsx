import type { Metadata } from "next";
import MemoryGame from "./MemoryGame";

export const metadata: Metadata = {
  title: "Memory Matching Game",
  description: "A number-pair memory matching game built with React.",
};

export default function Home() {
  return <MemoryGame />;
}
