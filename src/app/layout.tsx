import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EventPro | Professional Event Management Platform",
  description:
    "Enterprise-grade event management platform for planning, executing, and analyzing events at scale. Manage leads, guests, vendors, budgets, and teams all in one place.",
  keywords: [
    "event management",
    "event planning",
    "corporate events",
    "wedding planning",
    "conference management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
