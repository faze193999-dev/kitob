"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Book } from "@/lib/db";
import { ChevronLeft, ChevronRight, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface TrendingCarouselProps {
  books: Book[];
}

export const TrendingCarousel: React.FC<TrendingCarouselProps> = ({ books }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trendingBooks = books.filter((b) => b.trending);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="relative py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-zinc-800 tracking-tight">
              Trenddagi asarlar
            </h2>
            <p className="text-zinc-500 text-sm mt-1">Ushbu haftada eng ko'p o'qilgan kitoblar</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-2.5 rounded-xl bg-black/5 border border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-black/8 transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2.5 rounded-xl bg-black/5 border border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-black/8 transition-all duration-300 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x no-scrollbar pb-6 scroll-smooth"
        >
          {trendingBooks.map((book, idx) => (
            <motion.div
              key={book.id}
              className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
            >
              <Link href={`/reader/${book.id}`} className="block group">
                <div className="relative glass-card rounded-3xl p-4 flex flex-col h-full cursor-pointer overflow-hidden border border-black/5">
                  {/* Glowing hover card effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/0 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Book Cover */}
                  <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative border border-black/5 shadow-md mb-4">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-tr ${book.gradientFrom || "from-violet-600"} ${book.gradientTo || "to-indigo-800"} flex items-center justify-center p-6 text-center`}>
                        <h3 className="font-serif font-bold text-xl text-white leading-tight">{book.title}</h3>
                      </div>
                    )}
                    
                    {/* Read Now Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                      <span className="px-5 py-2.5 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-lg shadow-violet-500/10 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        O'qish
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/5 border border-black/5 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                      {book.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-zinc-650 font-medium">{book.rating}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-zinc-800 truncate group-hover:text-violet-700 transition-colors duration-200">
                    {book.title}
                  </h3>
                  
                  <p className="text-xs text-zinc-500 mt-1">muallif: {book.author}</p>
                  
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-3 leading-relaxed">
                    {book.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs text-zinc-500">
                    <span>{book.readTime} o'qish</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Eye className="w-3.5 h-3.5 text-zinc-600" />
                      {book.views.toLocaleString()} marta o'qildi
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
