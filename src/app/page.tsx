"use client";

import React, { useState, useEffect } from "react";
import { BookVerseDB, Book } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SearchBar } from "@/components/SearchBar";
import { TrendingCarousel } from "@/components/TrendingCarousel";
import { Categories } from "@/components/Categories";
import { Authors } from "@/components/Authors";
import { StatsCounter } from "@/components/StatsCounter";
import { Testimonials } from "@/components/Testimonials";

// New components
import { ContinueReading } from "@/components/ContinueReading";
import { ReadingChallenge } from "@/components/ReadingChallenge";
import { QuotesOfTheDay } from "@/components/QuotesOfTheDay";
import { Collections } from "@/components/Collections";
import { EditorialGrid } from "@/components/EditorialGrid";
import { TodaysPicks } from "@/components/TodaysPicks";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Fetch books from simulated db
    setBooks(BookVerseDB.getBooks());

    // Scroll listener for Top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter book lists for the various homepage sections
  const recommendedBooks = books.filter((b) => b.recommended);
  const newReleases = books.filter((b) => b.publishedYear >= 2025);
  const mostPopular = [...books].sort((a, b) => b.views - a.views);
  const editorsChoice = books.filter((b) => b.editorsChoice);
  const freeBooks = books.filter((b) => !b.premium);
  const premiumBooks = books.filter((b) => b.premium);
  const audioBooks = books.filter((b) => b.audiobook);

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Ambient backgrounds */}
      <div className="absolute top-[15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-200/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-200/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[70%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-200/5 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <Navbar onSearchClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })} />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Containers */}
      <main className="relative z-10">
        
        {/* AI-Powered Search Bar Section */}
        <section id="search-section" className="py-12 max-w-7xl mx-auto px-6 scroll-mt-24">
          <div className="glass-panel p-8 sm:p-12 rounded-[32px] text-center border border-black/5 relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-b from-violet-200/20 to-transparent blur-xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-500/5 border border-zinc-500/10 text-xs text-zinc-500 font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              Sun'iy intellekt asosidagi qidiruv
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-bold font-sans text-zinc-800 mb-4 tracking-tight leading-tight">
              Bugun qanday kitob kashf etasiz?
            </h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Kutubxona bazasini bir necha millisekundda qidiring, boblar va mualliflar bo'yicha tezkor natija oling.
            </p>
            
            <SearchBar />
          </div>
        </section>

        {/* 1. Continue Reading (Mutolaani davom ettirish) */}
        <ContinueReading />

        {/* 2. Reading Challenge (Mutolaa chorlovi) */}
        <ReadingChallenge />

        {/* 3. Today's Picks (Kun tanlovlari) */}
        <TodaysPicks books={books} />

        {/* 4. Trending (Trenddagilar) */}
        <TrendingCarousel books={books} />

        {/* 5. Recommended for You (Siz uchun tavsiyalar) */}
        <EditorialGrid
          title="Siz uchun tavsiyalar"
          description="Mutolaa tarixingiz va qiziqishlaringiz asosida tanlangan asarlar"
          books={recommendedBooks}
        />

        {/* 6. Collections (Maxsus to'plamlar) */}
        <Collections />

        {/* 7. Categories & Genres (Katalog) */}
        <div id="categories-section" className="scroll-mt-24">
          <Categories books={books} />
        </div>

        {/* 8. Editor's Choice (Muharrir tanlovi) */}
        <EditorialGrid
          title="Muharrir tanlovi"
          description="BookVerse muharrirlari tomonidan tavsiya etilgan eng sara asarlar"
          books={editorsChoice}
        />

        {/* 9. New Releases (Yangi nashrlar) */}
        <EditorialGrid
          title="Yangi nashrlar"
          description="Kutubxonamizga yaqin orada qo'shilgan so'nggi adabiyotlar"
          books={newReleases}
        />

        {/* 10. Most Popular (Eng ommabop) */}
        <EditorialGrid
          title="Eng ommabop"
          description="Kitobxonlar tomonidan eng ko'p o'qilgan va sevib mutolaa qilinayotgan kitoblar"
          books={mostPopular}
        />

        {/* 11. Audiobooks (Audio kitoblar) */}
        <EditorialGrid
          title="Audio kitoblar"
          description="Tinglash orqali kitob olamiga sayohat qilish uchun maxsus formatlar"
          books={audioBooks}
        />

        {/* 12. Free Books (Bepul kitoblar) */}
        <EditorialGrid
          title="Bepul kitoblar"
          description="Mutlaqo to'lovsiz va a'zoliksiz mutolaa qilish mumkin bo'lgan asarlar"
          books={freeBooks}
        />

        {/* 13. Premium Books (Premium kitoblar) */}
        <EditorialGrid
          title="Premium kitoblar"
          description="Eksklyuziv a'zolikka ega kitobxonlar uchun maxsus asarlar to'plami"
          books={premiumBooks}
        />

        {/* 14. Quotes of the Day (Kun iqtiboslari) */}
        <QuotesOfTheDay />

        {/* Platform telemetry */}
        <StatsCounter />

        {/* Featured Thinkers */}
        <Authors />

        {/* Testimonials */}
        <Testimonials />

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-500/10 bg-zinc-500/5 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-zinc-800 tracking-tight mb-4">
              Book<span className="text-violet-600">Verse</span>
            </h3>
            <p className="text-zinc-600 text-sm max-w-sm leading-relaxed font-sans">
              Yozma so'zning go'zalligi va chuqurligini saqlash, yoritish va yuksaltirish uchun mo'ljallangan oliy darajadagi raqamli makon. Biz diqqat jamlash va mutolaa go'zalligini birlashtiruvchi interfeyslarni yaratamiz.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Platforma</h4>
            <div className="flex flex-col gap-2.5 text-sm text-zinc-500 font-medium">
              <a href="#categories-section" className="hover:text-zinc-800 transition-colors duration-200">Kutubxona katalogi</a>
              <Link href="/dashboard" className="hover:text-zinc-800 transition-colors duration-200">Boshqaruv paneli</Link>
              <Link href="/auth" className="hover:text-zinc-800 transition-colors duration-200">Tizimga kirish</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Huquqiy</h4>
            <div className="flex flex-col gap-2.5 text-sm text-zinc-500 font-medium">
              <span className="cursor-pointer hover:text-zinc-800 transition-colors duration-200">Foydalanish shartlari</span>
              <span className="cursor-pointer hover:text-zinc-800 transition-colors duration-200">Maxfiylik siyosati</span>
              <span className="cursor-pointer hover:text-zinc-800 transition-colors duration-200">Kontent qoidalari</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-medium">
          <span>&copy; {new Date().getFullYear()} BookVerse Inc. Barcha huquqlar himoyalangan.</span>
          <span>Oliy darajadagi mutolaa qulayligi bilan yaratildi.</span>
        </div>
      </footer>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 rounded-xl bg-violet-600 border border-violet-500 text-white shadow-xl shadow-violet-500/10 z-50 cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
