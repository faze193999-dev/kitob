"use client";

import React, { useState, useEffect } from "react";
import { BookVerseDB } from "@/lib/db";
import { Cpu, Briefcase, Zap, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ComponentType<any>> = {
  Cpu,
  Briefcase,
  Zap,
  BookOpen
};

export const Collections: React.FC = () => {
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    setCollections(BookVerseDB.getCollections());
  }, []);

  if (collections.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800 tracking-tight leading-none">Maxsus to'plamlar</h2>
          <p className="text-zinc-500 text-xs mt-2">Mavzu va janrlar bo'yicha saralangan eng yaxshi materiallar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((col) => {
          const IconComponent = iconMap[col.icon] || BookOpen;
          return (
            <motion.div
              key={col.id}
              onClick={() => {
                // Smooth scroll to the categories section to show filtered books
                const catSection = document.getElementById("categories-section");
                if (catSection) {
                  catSection.scrollIntoView({ behavior: "smooth" });
                  // Simulate category selection if active
                  const btn = document.querySelector(`[data-category="${col.category}"]`) as HTMLButtonElement;
                  if (btn) btn.click();
                }
              }}
              className={`p-6 rounded-3xl border border-black/5 bg-gradient-to-br ${col.gradient} hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between h-48 group`}
              whileHover={{ y: -3 }}
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-violet-600 shadow-sm">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-800 leading-snug group-hover:text-violet-700 transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-1 font-sans line-clamp-2">
                    {col.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-violet-600 uppercase tracking-wider mt-4">
                Ko'rish
                <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
