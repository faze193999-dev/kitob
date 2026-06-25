"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Book } from "@/lib/db";
import { Cpu, Briefcase, Sparkles, GraduationCap, Atom, BookMarked, Eye, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoriesProps {
  books: Book[];
}

const CATEGORIES_META = [
  { name: "All", icon: BookMarked, color: "from-zinc-500 to-zinc-700" },
  { name: "Technology", icon: Cpu, color: "from-violet-500 to-indigo-600" },
  { name: "Business", icon: Briefcase, color: "from-amber-500 to-orange-600" },
  { name: "Self-Development", icon: Sparkles, color: "from-rose-500 to-pink-600" },
  { name: "Fiction", icon: Sparkles, color: "from-emerald-500 to-teal-600" },
  { name: "Science", icon: Atom, color: "from-blue-500 to-cyan-600" }
];

export const Categories: React.FC<CategoriesProps> = ({ books }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredBooks = selectedCategory === "All"
    ? books
    : books.filter((b) => b.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div id="discover" className="py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
            Browse by Genre
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Select a category to filter the library</p>
        </div>

        {/* Category selector grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {CATEGORIES_META.map((cat, idx) => {
            const isSelected = selectedCategory === cat.name;
            const Icon = cat.icon;
            
            return (
              <motion.button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? "bg-violet-600/10 border-violet-500 text-white"
                    : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:border-white/10 hover:bg-white/8"
                }`}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                {/* Glowing light indicator on active */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-violet-500/20 blur-md" />
                )}
                
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <span className="font-semibold text-sm tracking-wide">{cat.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Animated Books Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative glass-card rounded-3xl p-5 border border-white/5 flex flex-col justify-between"
              >
                <div>
                  {/* Book cover visual block */}
                  <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden relative border border-white/10 mb-4 bg-zinc-900 flex items-center justify-center">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-tr ${book.gradientFrom || "from-violet-600"} ${book.gradientTo || "to-indigo-800"} flex items-center justify-center p-4 text-center`}>
                        <h4 className="font-serif font-bold text-lg text-white leading-tight">{book.title}</h4>
                      </div>
                    )}
                    
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-zinc-300 font-medium border border-white/5 uppercase tracking-wider">
                      {book.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1 text-xs text-zinc-500 mb-1.5">
                    <span>by {book.author}</span>
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-zinc-300">{book.rating}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white truncate group-hover:text-violet-400 transition-colors duration-200">
                    {book.title}
                  </h3>

                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{book.readTime} read</span>
                  <Link
                    href={`/reader/${book.id}`}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-200 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all duration-300"
                  >
                    Read Book
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
