import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth-context";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stronix — Supply Chain Operations",
  description: "B2B supply-chain operations engine with inventory protection and explainable distributor assignment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/bb5de19d87c09a95216dc6ccd96e37c6?family=Nimbus+Sans+TW01"
        />
      </head>
      <body className={`${outfit.variable} ${geistMono.variable} font-sans bg-[#FAFAF7] text-[#111827]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
