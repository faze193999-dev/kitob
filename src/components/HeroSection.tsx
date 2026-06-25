"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, BookOpen } from "lucide-react";

export const HeroSection: React.FC = () => {
  // Variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 overflow-hidden">
      {/* Background Gradients and Orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-violet-600/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-cyan-600/10 blur-[130px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_0%,#050508_85%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Left Content */}
        <motion.div
          className="lg:col-span-7 flex flex-col items-start text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-violet-400 uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
            BookVerse 2.0 taqdimoti
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-none mb-6 font-sans text-white"
          >
            Mutolaaning Oliy <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Hashamati
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-zinc-400 max-w-xl mb-8 leading-relaxed font-sans"
          >
            Chalg'ituvchi omillarsiz, intellektual rivojlanish uchun maxsus yaratilgan kitob mutolaasi ekotizimini his eting. Shaxsiy sozlamalar va tahliliy mutolaa ma'lumotlari.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-4 items-center"
          >
            {/* Magnetic Button Simulation via Framer Motion */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Link
                href="/reader/odyssey-of-code"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm tracking-wide shadow-xl shadow-violet-500/20 hover:shadow-violet-500/35 transition-all duration-300 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Bepul o'qishni boshlash
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <a
                href="#discover"
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-300 font-semibold text-sm tracking-wide hover:text-white hover:border-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                Kutubxonani ko'rish
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Floating Books */}
        <div className="lg:col-span-5 relative h-[500px] w-full flex items-center justify-center">
          {/* Main Floating Book Cover 1: The Odyssey of Code */}
          <motion.div
            className="absolute z-30 w-[240px] h-[340px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] origin-bottom"
            initial={{ opacity: 0, y: 50, rotate: 5 }}
            animate={{ 
              opacity: 1, 
              y: [-10, 10, -10],
              rotate: [5, 7, 5]
            }}
            transition={{
              opacity: { duration: 1 },
              y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" }
            }}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/20 relative group">
              <img 
                src="/covers/odyssey.png" 
                alt="The Odyssey of Code" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>

          {/* Floating Book Cover 2: Mind & Flow */}
          <motion.div
            className="absolute z-20 w-[210px] h-[300px] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.4)] left-[10%] top-[15%] origin-bottom"
            initial={{ opacity: 0, y: 80, rotate: -12 }}
            animate={{ 
              opacity: 0.85, 
              y: [10, -10, 10],
              rotate: [-12, -10, -12]
            }}
            transition={{
              opacity: { duration: 1, delay: 0.2 },
              y: { repeat: Infinity, duration: 7, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 7, ease: "easeInOut" }
            }}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative">
              <img 
                src="/covers/mindflow.png" 
                alt="Mind & Flow" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>

          {/* Floating Book Cover 3: Sci-fi Gradient */}
          <motion.div
            className="absolute z-10 w-[190px] h-[270px] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] right-[10%] bottom-[15%] origin-bottom"
            initial={{ opacity: 0, y: 100, rotate: 18 }}
            animate={{ 
              opacity: 0.7, 
              y: [-5, 12, -5],
              rotate: [18, 16, 18]
            }}
            transition={{
              opacity: { duration: 1, delay: 0.4 },
              y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 5, ease: "easeInOut" }
            }}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-tr from-indigo-600 to-purple-800 flex flex-col justify-between p-6">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">Ilmiy-fantastika</span>
              <div>
                <h3 className="font-serif font-semibold text-base leading-tight text-white mb-1">Echoes of the Future</h3>
                <p className="text-[10px] text-zinc-400">Sarah Elson</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
