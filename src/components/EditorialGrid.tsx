"use client";

import React from "react";
import { Book } from "@/lib/db";
import { Star, Headphones, Crown, Play, Eye } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface EditorialGridProps {
  title: string;
  description: string;
  books: Book[];
}

export const EditorialGrid: React.FC<EditorialGridProps> = ({ title, description, books }) => {
  if (books.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800 tracking-tight leading-none">{title}</h2>
          <p className="text-zinc-500 text-xs mt-2">{description}</p>
        </div>
      </div>

      {/* Grid of Books */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {books.map((book) => {
          return (
            <motion.div
              key={book.id}
              className="flex flex-col group relative"
              whileHover={{ y: -4 }}
            >
              {/* Cover Card Container */}
              <div className="aspect-[3/4] w-full rounded-2xl bg-zinc-100 border border-black/5 flex-shrink-0 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all duration-300">
                {book.coverUrl ? (
                  <img src={book.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-tr ${book.gradientFrom || "from-violet-600"} ${book.gradientTo || "to-cyan-600"} group-hover:scale-105 transition-transform duration-500`} />
                )}

                {/* Top overlays: badges */}
                <div className="absolute top-2.5 inset-x-2.5 flex flex-wrap gap-1.5 z-10">
                  {book.premium ? (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                      <Crown className="w-2.5 h-2.5" />
                      Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                      Bepul
                    </span>
                  )}

                  {book.audiobook && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm" title="Audio kitob">
                      <Headphones className="w-2.5 h-2.5" />
                      Audio
                    </span>
                  )}
                </div>

                {/* Play/Read hover overlay */}
                <Link
                  href={`/reader/${book.id}`}
                  className="absolute inset-0 z-20 bg-white/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center"
                >
                  <div className="w-11 h-11 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {book.audiobook ? (
                      <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                    ) : (
                      <span className="text-xs font-bold font-sans">O'qish</span>
                    )}
                  </div>
                </Link>
              </div>

              {/* Title & Author Info */}
              <div className="mt-3.5 space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-violet-600 block">
                  {book.category}
                </span>
                
                <h3 className="text-xs sm:text-sm font-bold text-zinc-800 line-clamp-1 leading-snug group-hover:text-violet-750 transition-colors">
                  {book.title}
                </h3>
                
                <p className="text-[11px] text-zinc-500 line-clamp-1">by {book.author}</p>

                {/* Rating & stats metadata */}
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold pt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                    <span className="text-zinc-600 font-bold">{book.rating}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-0.5">
                    <Eye className="w-3 h-3" />
                    <span>{book.views > 1000 ? `${(book.views / 1000).toFixed(1)}k` : book.views}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
