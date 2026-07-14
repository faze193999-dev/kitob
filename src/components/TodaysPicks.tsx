"use client";

import React from "react";
import { Book } from "@/lib/db";
import { Star, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TodaysPicksProps {
  books: Book[];
}

export const TodaysPicks: React.FC<TodaysPicksProps> = ({ books }) => {
  const todaysPickBook = books.find((b) => b.todaysPick) || books[0];

  if (!todaysPickBook) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800 tracking-tight leading-none">Kun tanlovlari</h2>
          <p className="text-zinc-500 text-xs mt-2">Bugun mutolaa qilish uchun maxsus tanlangan kitob</p>
        </div>
      </div>

      {/* Hero-like Banner */}
      <motion.div
        className="glass-panel p-8 sm:p-12 rounded-[32px] border border-black/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Glow behind cover */}
        <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-violet-200/30 to-indigo-200/10 rounded-full blur-3xl pointer-events-none" />

        {/* Cover side */}
        <div className="w-40 sm:w-48 aspect-[3/4] rounded-2xl bg-zinc-100 border border-black/5 flex-shrink-0 overflow-hidden relative shadow-lg order-1 md:order-2 group">
          {todaysPickBook.coverUrl ? (
            <img src={todaysPickBook.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-tr ${todaysPickBook.gradientFrom || "from-violet-600"} ${todaysPickBook.gradientTo || "to-cyan-600"} group-hover:scale-105 transition-transform duration-500`} />
          )}
        </div>

        {/* Content side */}
        <div className="flex-1 space-y-5 text-center md:text-left order-2 md:order-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/15 text-xs text-amber-700 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Kunning eng sara asari
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-violet-600 block">
              {todaysPickBook.category}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-800 tracking-tight leading-tight">
              {todaysPickBook.title}
            </h3>
            <p className="text-sm text-zinc-500 font-medium">by {todaysPickBook.author}</p>
          </div>

          <p className="text-zinc-600 text-sm leading-relaxed max-w-xl font-sans">
            {todaysPickBook.description}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-6 text-xs text-zinc-500 font-semibold pt-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span className="text-zinc-800 font-bold text-sm">{todaysPickBook.rating}</span>
            </div>
            <span>•</span>
            <div>{todaysPickBook.readTime} mutolaa vaqti</div>
            {todaysPickBook.audiobook && (
              <>
                <span>•</span>
                <div className="text-indigo-600">Audio format mavjud ({todaysPickBook.audioDuration})</div>
              </>
            )}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Link
              href={`/reader/${todaysPickBook.id}`}
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-violet-600/10 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Mutolaani boshlash
            </Link>
          </div>
        </div>

      </motion.div>
    </section>
  );
};
