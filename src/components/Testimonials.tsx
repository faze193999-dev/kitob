"use client";

import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS_DATA = [
  {
    quote: "BookVerse mening raqamli mutolaa odatlarimni butunlay o'zgartirdi. Qaydlar olish, ajoyib tipografiya va maxsus yorug'/sepia rejimlari xuddi planshet tezligi bilan birlashtirilgan premium jismoniy kitobni eslatadi.",
    author: "Maximilian Kross",
    role: "Bosh me'mor, ArcTech",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
  },
  {
    quote: "Tadqiqotchi talaba sifatida, matnni belgilash va qaydlarni bir zumda saqlab qolish men uchun juda foydali bo'ldi. Interfeys toza, qorong'i va tinch — bu ko'zni charchatmasdan soatlab diqqatni jamlashga yordam beradi.",
    author: "Clara Johansson",
    role: "PhD nomzodi, Stokgolm Universiteti",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100"
  },
  {
    quote: "Admin interfeysi va maxsus EPUB formati ajoyib darajada qilingan. Men 400 sahifalik muhandislik hujjatini yukladim va u darhol tahlil qilinib, chiroyli ko'rinishga keldi. Bu haqiqiy professional darajadagi mutolaa tajribasi.",
    author: "Sarah Jenkins",
    role: "Mahsulot bo'limi direktori, Medium Labs",
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
