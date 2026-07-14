"use client";

import React, { useState, useEffect } from "react";
import { BookVerseDB } from "@/lib/db";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const QuotesOfTheDay: React.FC = () => {
  const [quotes, setQuotes] = useState<{ id: number; text: string; author: string }[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    setQuotes(BookVerseDB.getQuotes());
  }, []);

  if (quotes.length === 0) return null;

  const nextQuote = () => {
    setCurrentIdx((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentIdx((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const currentQuote = quotes[currentIdx];

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <div className="glass-panel p-8 sm:p-12 rounded-[32px] border border-black/5 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
        {/* Quote watermark icon */}
        <Quote className="absolute top-6 left-8 w-16 h-16 text-black/[0.02] transform -rotate-12 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto space-y-4"
          >
            <p className="text-lg sm:text-xl font-serif italic text-zinc-800 leading-relaxed">
              “{currentQuote.text}”
            </p>
            <div className="flex items-center justify-center gap-1">
              <span className="h-px w-4 bg-violet-600" />
              <span className="text-xs uppercase font-bold tracking-widest text-violet-600">
                {currentQuote.author}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel controls */}
        <div className="absolute inset-x-6 bottom-6 flex items-center justify-between sm:justify-center sm:gap-6 mt-6">
          <button
            onClick={prevQuote}
            className="w-9 h-9 rounded-xl bg-black/5 hover:bg-black/8 text-zinc-600 flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Pagination dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {quotes.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                  idx === currentIdx ? "w-6 bg-violet-600" : "w-1.5 bg-black/10"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextQuote}
            className="w-9 h-9 rounded-xl bg-black/5 hover:bg-black/8 text-zinc-600 flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
