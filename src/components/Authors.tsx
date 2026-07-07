"use client";

import React from "react";
import { Star, Award, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";

const AUTHORS_DATA = [
  {
    name: "Elena Rostova",
    role: "Tech Philosopher & Architect",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300",
    bio: "Elena specializes in systems design and human-AI collaboration. She is the bestselling author of 'The Odyssey of Code'.",
    stats: { books: 4, readers: "42k", rating: 4.9 },
    award: "IEEE Tech Writer of the Year"
  },
  {
    name: "Julian Vance",
    role: "Cognitive Scientist",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
    bio: "Julian researches high-performance states and focus triggers. He guides executives and creators in mastering mental flow.",
    stats: { books: 3, readers: "28k", rating: 4.8 },
    award: "Mindfulness Association Fellow"
  },
  {
    name: "Marcus Chen",
    role: "Startup Investor & Builder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    bio: "Marcus has built and scaled four unicorns. He compiles actionable insights on horizontal org structures and scaling engineering teams.",
    stats: { books: 5, readers: "85k", rating: 4.7 },
    award: "Forbes Venture Innovator Award"
  }
];

export const Authors: React.FC = () => {
  return (
    <div className="py-16 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-zinc-800 tracking-tight">
            Mashhur mualliflar
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Kitoblar va maqolalar ortidagi ijodkorlar bilan tanishing</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {AUTHORS_DATA.map((author, idx) => (
            <motion.div
              key={author.name}
              className="group relative rounded-3xl p-6 glass-card border border-black/5 overflow-hidden flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
            >
              {/* Glowing Background Blob */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/10 transition-all duration-300" />
              
              <div>
                {/* Author Card Head */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-black/5 flex-shrink-0 relative">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-800 group-hover:text-violet-700 transition-colors duration-200">
                      {author.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{author.role}</p>
                  </div>
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed mb-6 font-sans">
                  &quot;{author.bio}&quot;
                </p>

                {/* Award Badge */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-black/5 border border-black/5 text-zinc-700 text-xs mb-6">
                  <Award className="w-4 h-4 text-violet-600" />
                  <span className="truncate">{author.award}</span>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-black/5 text-center">
                <div>
                  <span className="flex items-center justify-center gap-1 text-xs text-zinc-500 mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Kitoblar
                  </span>
                  <span className="text-sm font-bold text-zinc-800">{author.stats.books}</span>
                </div>
                <div>
                  <span className="flex items-center justify-center gap-1 text-xs text-zinc-500 mb-1">
                    <Users className="w-3.5 h-3.5" />
                    O'quvchilar
                  </span>
                  <span className="text-sm font-bold text-zinc-800">{author.stats.readers}</span>
                </div>
                <div>
                  <span className="flex items-center justify-center gap-1 text-xs text-zinc-500 mb-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Reyting
                  </span>
                  <span className="text-sm font-bold text-zinc-800">{author.stats.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
