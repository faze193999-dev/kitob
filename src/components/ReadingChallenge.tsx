"use client";

import React, { useState, useEffect } from "react";
import { Award, Zap, Plus, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export const ReadingChallenge: React.FC = () => {
  const [dailyMinutes, setDailyMinutes] = useState(15);
  const [dailyGoal, setDailyGoal] = useState(30);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    // Load local state
    const savedMins = localStorage.getItem("bv_challenge_mins");
    const savedGoal = localStorage.getItem("bv_challenge_goal");
    if (savedMins) setDailyMinutes(parseInt(savedMins, 10));
    if (savedGoal) setDailyGoal(parseInt(savedGoal, 10));
  }, []);

  const addMinutes = (amount: number) => {
    const nextMins = Math.min(120, dailyMinutes + amount);
    setDailyMinutes(nextMins);
    localStorage.setItem("bv_challenge_mins", nextMins.toString());

    if (nextMins >= dailyGoal && !hasCelebrated) {
      setHasCelebrated(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#8b5cf6", "#6366f1", "#10b981"]
      });
    }
  };

  const resetChallenge = () => {
    setDailyMinutes(0);
    setHasCelebrated(false);
    localStorage.setItem("bv_challenge_mins", "0");
  };

  const percentage = Math.min(100, Math.round((dailyMinutes / dailyGoal) * 100));

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-black/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Background design elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Text Details */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/10 text-xs text-violet-700 font-medium">
            <Award className="w-3.5 h-3.5" />
            Kunlik mutolaa chorlovi
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-zinc-800 tracking-tight">
            Mutolaa maqsadlariga erishing
          </h2>
          <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
            Har kuni kamida 30 daqiqa kitob o'qing va fikrlash doirangizni kengaytiring. Har bir daqiqa sizni intellektual yuksaklikka yaqinlashtiradi.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={() => addMinutes(5)}
              className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/8 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              5 daqiqa qo'shish
            </button>
            <button
              onClick={() => addMinutes(15)}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-violet-600/10 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              15 daqiqa qo'shish
            </button>
            {percentage >= 100 && (
              <button
                onClick={resetChallenge}
                className="px-3 py-2 rounded-xl border border-black/5 hover:bg-black/5 text-zinc-400 hover:text-zinc-600 text-xs transition-all cursor-pointer"
              >
                Qayta tiklash
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Progress Ring */}
        <div className="flex flex-col items-center justify-center gap-4 flex-shrink-0 w-full sm:w-auto">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-black/5"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-violet-600"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={377}
                initial={{ strokeDashoffset: 377 }}
                animate={{ strokeDashoffset: 377 - (377 * percentage) / 100 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-zinc-800 tracking-tight">{dailyMinutes} / {dailyGoal}</span>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">daqiqa</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {percentage >= 100 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-full"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Bugungi maqsad bajarildi!
              </motion.div>
            ) : (
              <div className="flex items-center gap-1 text-zinc-500 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
                Bajarildi: {percentage}%
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
