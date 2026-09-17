import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Darshana Nuwan | Science Pothigula – O/L & A/L Science Tuition",
  description:
    "Premium O/L & A/L Science tuition classes by Darshana Nuwan Sir. Expert teaching for Physics, Chemistry, Biology and Mathematics. Online video lessons, model papers, and books.",
  keywords: "science tuition, O/L science, A/L physics, Sri Lanka tuition, online science class, Darshana Nuwan, Science Pothigula",
  openGraph: {
    title: "Darshana Nuwan | Science Pothigula",
    description: "Expert O/L & A/L Science tuition by Darshana Nuwan Sir – Science Pothigula",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
