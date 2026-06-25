"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BookVerseDB, Book } from "@/lib/db";
import { Search, X, BookOpen, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const SearchBar: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    // Let's fix the ref bug before writing: it's containerRef.current. Keep it simple
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const books = BookVerseDB.getBooks();
    const filtered = books.filter(
      (b) =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase()) ||
        b.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 5)); // Cap at 5 results
  }, [query]);

  const handleSelectBook = (id: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/reader/${id}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-40">
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Kitob nomi, muallif yoki janr bo'yicha qidirish (masalan: Texnologiya)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:bg-white/8 transition-all duration-300 shadow-xl"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-4 p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && (query.trim().length > 0 || results.length > 0) && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-3 rounded-2xl glass-panel p-3 z-50 max-h-[380px] overflow-y-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {results.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <div className="px-3 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Qidiruv natijalari ({results.length})
                </div>
                {results.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => handleSelectBook(book.id)}
                    className="w-full flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 text-left transition-all duration-200 group cursor-pointer"
                  >
                    {/* Cover Preview */}
                    <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 relative">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-tr ${book.gradientFrom || "from-violet-600"} ${book.gradientTo || "to-indigo-800"}`} />
                      )}
                    </div>

                    {/* Book Metadata */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-violet-400 transition-colors duration-200">
                        {book.title}
                      </h4>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{book.author}</p>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-white/5 border border-white/5 text-zinc-400 rounded-md mt-1">
                        {book.category}
                      </span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-200" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
                <BookOpen className="w-8 h-8 text-zinc-700" />
                <p className="text-sm">&quot;{query}&quot; bo'yicha hech qanday kitob topilmadi</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
