"use client";

import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS_DATA = [
  {
    quote: "BookVerse has completely redefined my digital reading rituals. The separation of reading notes, beautiful typography, and custom light/sepia options feels like an premium physical book blended with the speed of an iPad.",
    author: "Maximilian Kross",
    role: "Chief Architect, ArcTech",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
  },
  {
    quote: "As a research student, the inline highlighting and instant notes saving have been invaluable. The interface is clean, dark, and beautifully quiet—allowing hours of focused study without eye strain.",
    author: "Clara Johansson",
    role: "PhD Candidate, Stockholm University",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100"
  },
  {
    quote: "The admin interface and custom EPUB layout is spectacular. I uploaded a 400-page custom engineering document, and the parsing was immediate and beautiful. This is a billion-dollar reading experience.",
    author: "Sarah Jenkins",
    role: "Director of Product, Medium Labs",
    avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=100"
  }
];

export const Testimonials: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-16 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Quote Icon */}
        <div className="inline-flex p-4 rounded-3xl bg-violet-600/10 border border-violet-500/20 text-violet-400 mb-8">
          <Quote className="w-8 h-8 rotate-180" />
        </div>

        {/* Text Area with Animated Transition */}
        <div className="min-h-[220px] sm:min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <p className="text-xl sm:text-2xl font-serif text-zinc-200 leading-relaxed max-w-3xl italic">
                &quot;{TESTIMONIALS_DATA[activeIdx].quote}&quot;
              </p>
              
              <div className="flex items-center gap-3 mt-8">
                <img
                  src={TESTIMONIALS_DATA[activeIdx].avatar}
                  alt={TESTIMONIALS_DATA[activeIdx].author}
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white">{TESTIMONIALS_DATA[activeIdx].author}</h4>
                  <p className="text-xs text-zinc-500">{TESTIMONIALS_DATA[activeIdx].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-8">
          {TESTIMONIALS_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                activeIdx === idx ? "w-8 bg-violet-500" : "w-2 bg-white/10 hover:bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
