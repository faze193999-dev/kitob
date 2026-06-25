"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Users, Award, Star } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface StatItemProps {
  label: string;
  target: number;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, target, suffix = "", icon: Icon, color }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    const duration = 1800; // ms
    const increment = end / (duration / 16); // ~60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="p-6 rounded-3xl glass-card border border-white/5 flex flex-col items-center text-center relative group">
      {/* Glow highlight */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-3xl`} />
      
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-105 group-hover:text-violet-300 transition-all duration-300">
        <Icon className="w-6 h-6" />
      </div>

      <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-sans">
        {count.toLocaleString()}{suffix}
      </span>
      
      <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-2">
        {label}
      </span>
    </div>
  );
};

export const StatsCounter: React.FC = () => {
  return (
    <div className="py-16 border-t border-white/5 bg-black/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem
            label="Raqamli kutubxona"
            target={1480}
            suffix="+"
            icon={BookOpen}
            color="from-violet-600 to-indigo-600"
          />
          <StatItem
            label="Faol mutolaachilar"
            target={85200}
            suffix="+"
            icon={Users}
            color="from-cyan-600 to-blue-600"
          />
          <StatItem
            label="Mashhur ijodkorlar"
            target={120}
            suffix="+"
            icon={Award}
            color="from-rose-600 to-pink-600"
          />
          <StatItem
            label="Foydalanuvchi eslatmalari"
            target={340000}
            suffix="+"
            icon={Star}
            color="from-amber-600 to-orange-600"
          />
        </div>
      </div>
    </div>
  );
};
