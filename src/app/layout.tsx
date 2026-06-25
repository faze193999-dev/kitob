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
  title: "BookVerse | Oliy darajadagi raqamli mutolaa platformasi",
  description: "Oliy darajadagi mutolaa tajribasiga sho'ng'ing. Mavzularni sozlang, matnlarni belgilang, tahlillaringizni kuzatib boring va minglab klassik hamda zamonaviy asarlarni o'qing.",
  keywords: ["BookVerse", "onlayn mutolaa", "raqamli kutubxona", "EPUB o'quvchi", "PDF o'quvchi", "kitob mutolaasi", "Next.js kitob ilovasi"],
  authors: [{ name: "BookVerse Jamoasi" }],
  openGraph: {
    title: "BookVerse - Oliy darajadagi raqamli mutolaa platformasi",
    description: "Maxsus sozlamalar, tungi rejim, xatcho'plar va to'liq jihozlangan admin paneli bilan oliy darajadagi mutolaa tajribasiga sho'ng'ing.",
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
      lang="uz"
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


