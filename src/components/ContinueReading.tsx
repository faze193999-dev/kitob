"use client";

import React from "react";
import { BookVerseDB, Book } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";
import { Play, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const ContinueReading: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const progressList = BookVerseDB.getAllProgress(user.id);
  if (progressList.length === 0) return null;

  // Get matching books and sort by lastReadAt
  const activeItems = progressList
    .map((prog) => {
      const book = BookVerseDB.getBookById(prog.bookId);
      return { prog, book };
    })
    .filter((item): item is { prog: any; book: Book } => !!item.book)
    .sort((a, b) => new Date(b.prog.lastReadAt).getTime() - new Date(a.prog.lastReadAt).getTime());

  if (activeItems.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800 tracking-tight leading-none">Mutolaani davom ettirish</h2>
          <p className="text-zinc-500 text-xs mt-2">So'nggi o'qigan kitoblaringiz ro'yxati</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeItems.map(({ prog, book }) => {
          return (
            <motion.div
              key={book.id}
              className="glass-panel p-5 rounded-3xl border border-black/5 hover:border-violet-500/20 hover:shadow-lg transition-all duration-300 flex gap-4 group relative overflow-hidden"
              whileHover={{ y: -3 }}
            >
              {/* Cover */}
              <div className="w-16 h-22 rounded-xl bg-zinc-100 border border-black/5 flex-shrink-0 overflow-hidden relative shadow-sm">
                {book.coverUrl ? (
                  <img src={book.coverUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-tr ${book.gradientFrom || "from-violet-600"} ${book.gradientTo || "to-cyan-600"}`} />
                )}
              </div>

              {/* Meta */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-violet-600 block mb-1">
                    {book.category}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-800 truncate leading-snug group-hover:text-violet-700 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">by {book.author}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-500 font-semibold">
                    <span>Tugallandi</span>
                    <span>{Math.round(prog.percentage)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-600 rounded-full transition-all duration-500"
                      style={{ width: `${prog.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Continue Link hover trigger */}
              <Link
                href={`/reader/${book.id}`}
                className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
