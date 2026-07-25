import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";

import { company } from "@/lib/company";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://boazgroup.co.tz"),
  title: {
    default: `${company.name} — Cross-Border Freight from Tanzania to the EAC`,
    template: `%s | ${company.name}`,
  },
  description:
    "Cross-border road freight, customs clearance and warehousing from Dar es Salaam to Rwanda, Kenya, Burundi and Uganda.",
  icons: { icon: "/brand/boaz-logo.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#232A73",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
