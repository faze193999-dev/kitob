import type { Metadata } from "next";
import { Outfit, Playfair_Display, Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookVerse | Luxury Digital Reading Platform",
  description: "Immerse yourself in a premium reading experience. Customize themes, highlight texts, track your analytics, and read thousands of classics and modern articles.",
  keywords: ["BookVerse", "online reading", "digital book library", "EPUB reader", "PDF reader", "Medium reading style", "Next.js book app"],
  authors: [{ name: "BookVerse Team" }],
  openGraph: {
    title: "BookVerse - Luxury Digital Reading Platform",
    description: "Immerse yourself in a premium reading experience with custom settings, dark mode, bookmarks, and a fully featured admin dashboard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans select-none bg-[#050508] text-[#f4f4f5]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}


