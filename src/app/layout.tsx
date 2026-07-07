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
      <body className="min-h-full flex flex-col font-sans select-none bg-background text-foreground transition-colors duration-300 relative">
        {/* Global plaster texture and shadow hand backdrop */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* Subtle plaster/paper overlay texture */}
          <div className="absolute inset-0 bg-repeat opacity-[0.015] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          
          {/* Shadow of hand/plant matching user uploaded image */}
          <div 
            className="absolute top-0 right-0 w-[450px] h-[900px] bg-no-repeat bg-contain opacity-[0.16] mix-blend-multiply pointer-events-none dark:opacity-[0.03] transition-opacity duration-500"
            style={{ 
              backgroundImage: "url('/shadow-hand.png')", 
              backgroundPosition: "top right",
            }} 
          />
        </div>
        <AuthProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}


