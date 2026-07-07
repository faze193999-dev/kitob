"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { BookVerseDB, Book, ReadingProgress, Bookmark } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import {
  BookOpen,
  Calendar,
  Flame,
  Award,
  Clock,
  Edit3,
  Bookmark as BookmarkIcon,
  CheckCircle2,
  BookMarked,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, updateUserProfile, loading } = useAuth();
  const router = useRouter();
  
  // Library Tabs: 'progress' | 'saved' | 'completed'
  const [activeTab, setActiveTab] = useState<"progress" | "saved" | "completed">("progress");
  
  const [books, setBooks] = useState<Book[]>([]);
  const [progressList, setProgressList] = useState<ReadingProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Profile Edit modal
  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [bioInput, setBioInput] = useState("");

  useEffect(() => {
    if (!user) return;
    
    // Load data from DB
    const allBooks = BookVerseDB.getBooks();
    setBooks(allBooks);
    setProgressList(BookVerseDB.getAllProgress(user.id));
    setBookmarks(BookVerseDB.getBookmarks(user.id));
    setAnalytics(BookVerseDB.getAnalytics(user.id));

    // Populate profile inputs
    setUsernameInput(user.username);
    setBioInput(user.bio || "");
  }, [user]);

  // Redirect to login if user session is absent and loading finishes
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    updateUserProfile(usernameInput, bioInput);
    setIsEditing(false);
  };

  if (loading || !user || !analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  // Filter books based on active tab
  const getFilteredBooks = () => {
    if (activeTab === "progress") {
      // Books with progress > 0 and < 99%
      return progressList
        .filter((p) => p.percentage > 0 && p.percentage < 99)
        .map((p) => {
          const book = books.find((b) => b.id === p.bookId);
          return book ? { ...book, progressPercent: p.percentage } : null;
        })
        .filter((b) => b !== null) as (Book & { progressPercent: number })[];
    } else if (activeTab === "completed") {
      // Books with progress >= 99%
      return progressList
        .filter((p) => p.percentage >= 99)
        .map((p) => {
          const book = books.find((b) => b.id === p.bookId);
          return book ? book : null;
        })
        .filter((b) => b !== null) as Book[];
    } else {
      // Bookmarked books
      const bookmarkedIds = Array.from(new Set(bookmarks.map((b) => b.bookId)));
      return bookmarkedIds
        .map((id) => books.find((b) => b.id === id))
        .filter((b) => b !== undefined) as Book[];
    }
  };

  const filteredItems = getFilteredBooks();

  // Find max minutes for charting scale
  const maxChartMinutes = Math.max(...analytics.weeklyActivity.map((d: any) => d.minutes), 10);

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Left Column: Profile Card & Reading Stats Charts */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Profile Card */}
          <div className="glass-panel p-6 rounded-3xl border border-black/5 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl bg-black/5 border border-black/5 text-zinc-500 hover:text-zinc-950 hover:bg-black/8 transition-colors cursor-pointer"
                title="Profilni tahrirlash"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-violet-500/10 mb-4"
              />
              <h2 className="text-xl font-bold text-zinc-800 tracking-tight">{user.username}</h2>
              <span className="text-xs text-violet-700 font-semibold bg-violet-600/10 px-3 py-1 rounded-full mt-1.5 uppercase tracking-wider">
                {user.role === 'admin' ? 'Admin' : 'Oddiy'} a'zosi
              </span>
              
              <p className="text-sm text-zinc-600 mt-4 leading-relaxed font-sans max-w-[280px]">
                {user.bio || "Profil ma'lumotlari hali kiritilmagan."}
              </p>

              <div className="w-full h-px bg-black/5 my-6" />

              <div className="w-full flex items-center justify-between text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-zinc-600" />
                  Qo'shilgan sana: {new Date(user.joinedAt).toLocaleDateString("uz-UZ", { year: 'numeric', month: 'short' })}
                </span>
                <span>ID: {user.id}</span>
              </div>
            </div>
          </div>

          {/* Reading Statistics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-black/5 flex flex-col justify-between">
              <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                Kunlik faollik
              </span>
              <div>
                <h3 className="text-2xl font-bold text-zinc-800 leading-none">{analytics.streak}</h3>
                <span className="text-[10px] text-zinc-500 mt-1 block">faol kunlar</span>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-black/5 flex flex-col justify-between">
              <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Mutolaa vaqti
              </span>
              <div>
                <h3 className="text-2xl font-bold text-zinc-800 leading-none">{analytics.totalMinutes}</h3>
                <span className="text-[10px] text-zinc-500 mt-1 block">jami daqiqa</span>
              </div>
            </div>
          </div>

          {/* Weekly Minutes Custom Bar Graph */}
          <div className="glass-panel p-5 rounded-3xl border border-black/5">
            <h3 className="text-sm font-bold text-zinc-800 tracking-wide mb-4">Haftalik faollik</h3>
            
            {/* SVG custom bar graph */}
            <div className="h-44 w-full flex items-end justify-between gap-2.5 pt-4">
              {analytics.weeklyActivity.map((day: any, idx: number) => {
                const heightPercent = (day.minutes / maxChartMinutes) * 100;
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                    <div className="w-full relative flex items-end justify-center h-28">
                      {/* Tooltip on hover */}
                      <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-white border border-black/5 text-[9px] text-zinc-800 shadow-md px-1.5 py-0.5 rounded transition-opacity duration-200 pointer-events-none">
                        {day.minutes}m
                      </span>
                      {/* Bar fill */}
                      <motion.div
                        className="w-full rounded-t-md bg-gradient-to-t from-violet-600 to-indigo-500"
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Library Navigation & Book cards */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Tab Selection */}
          <div className="flex items-center gap-3 border-b border-black/5 pb-1">
            {[
              { id: "progress", name: "O'qilmoqda", icon: BookOpen },
              { id: "saved", name: "Xatcho'plar", icon: BookmarkIcon },
              { id: "completed", name: "Tugallangan", icon: CheckCircle2 }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold tracking-wide border-b-2 cursor-pointer transition-all ${
                    isActive
                      ? "border-violet-500 text-zinc-900 font-bold"
                      : "border-transparent text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Cards List Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                filteredItems.map((book) => {
                  const hasProgress = "progressPercent" in book;
                  const progressVal = hasProgress ? (book as any).progressPercent : 0;
                  
                  return (
                    <motion.div
                      key={book.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="glass-card rounded-3xl p-5 border border-black/5 flex flex-col justify-between group"
                    >
                      <div>
                        {/* cover element */}
                        <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden relative border border-black/5 mb-4 bg-zinc-100 flex items-center justify-center">
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
                        </div>

                        <span className="text-[10px] uppercase font-bold tracking-widest text-violet-600 block mb-1">
                          {book.category}
                        </span>
                        
                        <h3 className="text-base font-bold text-zinc-800 truncate group-hover:text-violet-700 transition-colors">
                          {book.title}
                        </h3>
                        
                        <p className="text-xs text-zinc-500">by {book.author}</p>

                        {/* Progress Bar (In progress tab) */}
                        {hasProgress && (
                          <div className="mt-4 space-y-1.5">
                            <div className="flex justify-between text-[10px] text-zinc-500 font-semibold">
                              <span>Tugallandi</span>
                              <span>{Math.round(progressVal)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-violet-500 rounded-full"
                                style={{ width: `${progressVal}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                        <span className="text-xs text-zinc-500">{book.readTime} mutolaa vaqti</span>
                        <Link
                          href={`/reader/${book.id}`}
                          className="px-4.5 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-500 text-xs font-semibold shadow-lg shadow-violet-600/10 transition-all"
                        >
                          {hasProgress ? "Davom etish" : "O'qish"}
                        </Link>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-2 py-16 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
                  <BookMarked className="w-10 h-10 text-zinc-400" />
                  <p className="text-sm">Ushbu ruknda kitob topilmadi.</p>
                  <Link
                    href="/"
                    className="px-4.5 py-2 rounded-xl border border-black/10 hover:border-violet-500 hover:text-violet-700 text-xs font-semibold transition-all mt-2"
                  >
                    Katalogga o'tish
                  </Link>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
            
            <motion.div
              className="w-full max-w-md glass-panel p-8 rounded-3xl border border-black/5 z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-zinc-800">Profilni tahrirlash</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-full hover:bg-black/5 text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Foydalanuvchi nomi</label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-zinc-800 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 transition-all focus:bg-white/80"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Profil ma'lumotlari</label>
                  <textarea
                    rows={4}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-zinc-800 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 transition-all resize-none font-sans focus:bg-white/80"
                    placeholder="O'zingiz haqingizda yozing..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-sm text-white shadow-xl shadow-violet-600/10 transition-all cursor-pointer mt-6"
                >
                  O'zgarishlarni saqlash
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
