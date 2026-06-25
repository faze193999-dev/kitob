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

  return (
    <div className="min-h-screen bg-[#050508] relative selection:bg-violet-600/30">
      {/* Ambient backgrounds */}
      <div className="absolute top-[30%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-[60%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/5 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <Navbar onSearchClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })} />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Containers */}
      <main className="relative z-10">
        
        {/* Search Bar Section */}
        <section id="search-section" className="py-12 max-w-7xl mx-auto px-6 scroll-mt-24">
          <div className="glass-panel p-8 sm:p-12 rounded-[32px] text-center border border-white/5 relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-b from-violet-500/10 to-transparent blur-xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-400 font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Sun'iy intellekt asosidagi qidiruv
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-bold font-sans text-white mb-4 tracking-tight leading-tight">
              Bugun qanday kitob kashf etasiz?
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Kutubxona bazasini bir necha millisekundda qidiring, boblar va mualliflar bo'yicha tezkor natija oling.
            </p>
            
            <SearchBar />
          </div>
        </section>

        {/* Trending Slider */}
        <TrendingCarousel books={books} />

        {/* Genres & Library Selector */}
        <Categories books={books} />

        {/* Stats Counter */}
        <StatsCounter />

        {/* Featured Thinkers */}
        <Authors />

        {/* Testimonials */}
        <Testimonials />

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-white tracking-tight mb-4">
              Book<span className="text-violet-500">Verse</span>
            </h3>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed font-sans">
              Yozma so'zning go'zalligi va chuqurligini saqlash, yoritish va yuksaltirish uchun mo'ljallangan oliy darajadagi raqamli makon. Biz diqqat jamlash va mutolaa go'zalligini birlashtiruvchi interfeyslarni yaratamiz.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Platforma</h4>
            <div className="flex flex-col gap-2.5 text-sm text-zinc-500 font-medium">
              <a href="#discover" className="hover:text-white transition-colors duration-200">Kutubxona katalogi</a>
              <Link href="/dashboard" className="hover:text-white transition-colors duration-200">Boshqaruv paneli</Link>
              <Link href="/auth" className="hover:text-white transition-colors duration-200">Tizimga kirish</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Huquqiy</h4>
            <div className="flex flex-col gap-2.5 text-sm text-zinc-500 font-medium">
              <span className="cursor-pointer hover:text-white transition-colors duration-200">Foydalanish shartlari</span>
              <span className="cursor-pointer hover:text-white transition-colors duration-200">Maxfiylik siyosati</span>
              <span className="cursor-pointer hover:text-white transition-colors duration-200">Kontent qoidalari</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 font-medium">
          <span>&copy; {new Date().getFullYear()} BookVerse Inc. Barcha huquqlar himoyalangan.</span>
          <span>Oliy darajadagi mutolaa qulayligi bilan yaratildi.</span>
        </div>
      </footer>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 rounded-xl bg-violet-600 border border-violet-500 text-white shadow-xl shadow-violet-500/20 z-50 cursor-pointer"
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
