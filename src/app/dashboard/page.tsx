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
  X,
  Crown,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Brain,
  Sparkles,
  ArrowRight,
  Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

const AVATAR_GRADIENTS = [
  { id: "owl", name: "🦉 Bilimdon Boyqush", style: "from-violet-500 to-indigo-600" },
  { id: "fox", name: "🦊 Topqir Tulki", style: "from-orange-500 to-amber-600" },
  { id: "lion", name: "🦁 Jasur Sher", style: "from-yellow-500 to-orange-600" },
  { id: "panda", name: "🐼 Muloyim Panda", style: "from-zinc-600 to-zinc-900" },
  { id: "unicorn", name: "🦄 Sehrli Yagona shox", style: "from-pink-500 to-violet-600" },
  { id: "eagle", name: "🦅 Mag'rur Lochin", style: "from-cyan-500 to-blue-600" }
];

export default function DashboardPage() {
  const { user, updateUserProfile, loading } = useAuth();
  const router = useRouter();

  // Navigation Tabs: 'progress' | 'saved' | 'completed' | 'achievements' | 'payments'
  const [activeTab, setActiveTab] = useState<"progress" | "saved" | "completed" | "payments">("progress");

  const [books, setBooks] = useState<Book[]>([]);
  const [progressList, setProgressList] = useState<ReadingProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Profile Edit modal states
  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState("owl");

  // AI Recommendation Panel states
  const [selectedMood, setSelectedMood] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Promo Code states
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);

  // Mock Payment History
  const [payments, setPayments] = useState([
    { id: "pay-101", date: "2026-07-01", sum: "19,000 UZS", method: "Click", status: "Muvaffaqiyatli" },
    { id: "pay-102", date: "2026-06-01", sum: "19,000 UZS", method: "Payme", status: "Muvaffaqiyatli" },
    { id: "pay-103", date: "2026-05-01", sum: "19,000 UZS", method: "Uzcard", status: "Muvaffaqiyatli" }
  ]);

  useEffect(() => {
    if (!user) return;

    // Load data from DB
    const allBooks = BookVerseDB.getBooks();
    setBooks(allBooks);
    setProgressList(BookVerseDB.getAllProgress(user.id));
    setBookmarks(BookVerseDB.getBookmarks(user.id));
    setAnalytics(BookVerseDB.getAnalytics(user.id));

    // Populate inputs
    setUsernameInput(user.username);
    setBioInput(user.bio || "");
    const matchingAvatar = AVATAR_GRADIENTS.find((a) => user.avatarUrl?.includes(a.style));
    if (matchingAvatar) setSelectedAvatarId(matchingAvatar.id);
  }, [user]);

  // Redirect to login if user is missing
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading || !user || !analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  // Profile Save
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    const matchedAvatar = AVATAR_GRADIENTS.find((a) => a.id === selectedAvatarId);
    const avatarUrl = matchedAvatar
      ? `bg-gradient-to-tr ${matchedAvatar.style}`
      : "bg-gradient-to-tr from-violet-500 to-indigo-600";

    updateUserProfile(usernameInput, bioInput);
    
    // Save locally to user profile preferences
    const u = localStorage.getItem("bv_active_user");
    if (u) {
      const parsed = JSON.parse(u);
      parsed.avatarUrl = avatarUrl;
      localStorage.setItem("bv_active_user", JSON.stringify(parsed));
    }
    
    setIsEditing(false);
    confetti({ particleCount: 50, spread: 30 });
    // Reload window to apply avatar
    window.location.reload();
  };

  // AI Recommendation engine trigger
  const triggerAiRecommendations = (mood: string) => {
    setSelectedMood(mood);
    setIsAiLoading(true);
    setAiRecommendation(null);

    setTimeout(() => {
      // Logic: pick books based on category keyword
      let selectedCategory = "Texnologiya";
      let reasoning = "";
      if (mood === "growth") {
        selectedCategory = "Shaxsiy rivojlanish";
        reasoning = "Sizning shaxsiy yuksalish, unumdorlik va diqqatni jamlashga bo'lgan qiziqishlaringiz asosida tanlandi. Ushbu kitob samarali muloqot va vaqtni boshqarish sirlarini ochib beradi.";
      } else if (mood === "biz") {
        selectedCategory = "Biznes";
        reasoning = "Kompaniyalar yaratish va biznes tahlillari bilan qiziquvchilar uchun eng sara qo'llanmalardan biri. Startap olamida to'g'ri strategiya tanlash bo'yicha amaliy maslahatlar berilgan.";
      } else {
        selectedCategory = "Badiiy adabiyot";
        reasoning = "Hordiq chiqarish va tasavvur dunyosiga sayohat qilish uchun ajoyib dramatik klassika. Har bir satrida inson psixologiyasi chuqur tahlil qilingan.";
      }

      const matchingBooks = books.filter((b) => b.category === selectedCategory);
      const recommendedBook = matchingBooks[Math.floor(Math.random() * matchingBooks.length)] || books[0];

      setAiRecommendation({
        book: recommendedBook,
        reasoning
      });
      setIsAiLoading(false);
      confetti({ particleCount: 40, spread: 25 });
    }, 1500);
  };

  // Promo Code Validation
  const handleValidatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoMessage("");
    setPromoSuccess(false);

    if (promoCode.trim().toUpperCase() === "BOOKVERSE2026") {
      setPromoSuccess(true);
      setPromoMessage("Muvaffaqiyatli! Premium obuna 1 oyga bepul taqdim etildi.");
      confetti({ particleCount: 80, spread: 60 });
    } else {
      setPromoSuccess(false);
      setPromoMessage("Noto'g'ri promo-kod kiritildi. Iltimos, qayta urinib ko'ring.");
    }
  };

  // Derived properties for profile stats
  const completedBooksCount = progressList.filter((p) => p.percentage >= 99).length;
  const mockPagesRead = completedBooksCount * 220 + progressList.reduce((sum, p) => sum + Math.round(p.percentage * 1.6), 0);
  const mockListeningHours = progressList.length * 1.5 + (user.role === "admin" ? 6.2 : 0);

  // Filtered books
  const getFilteredBooks = () => {
    if (activeTab === "progress") {
      return progressList
        .filter((p) => p.percentage > 0 && p.percentage < 99)
        .map((p) => {
          const book = books.find((b) => b.id === p.bookId);
          return book ? { ...book, progressPercent: p.percentage } : null;
        })
        .filter((b) => b !== null) as (Book & { progressPercent: number })[];
    } else if (activeTab === "completed") {
      return progressList
        .filter((p) => p.percentage >= 99)
        .map((p) => books.find((b) => b.id === p.bookId))
        .filter((b) => b !== undefined) as Book[];
    } else {
      const bookmarkedIds = Array.from(new Set(bookmarks.map((b) => b.bookId)));
      return bookmarkedIds
        .map((id) => books.find((b) => b.id === id))
        .filter((b) => b !== undefined) as Book[];
    }
  };

  const filteredItems = getFilteredBooks();
  const maxChartMinutes = Math.max(...analytics.weeklyActivity.map((d: any) => d.minutes), 10);

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        
        {/* Left Column: Profile Card, Achievements & Charts */}
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
              <div className={`w-20 h-20 rounded-3xl ${
                user.avatarUrl && user.avatarUrl.startsWith("bg-gradient")
                  ? user.avatarUrl
                  : "bg-gradient-to-tr from-violet-500 to-indigo-600"
              } ring-2 ring-violet-500/10 mb-4 flex items-center justify-center text-white text-3xl font-bold`}>
                {user.avatarUrl && user.avatarUrl.includes("owl") ? "🦉" :
                 user.avatarUrl && user.avatarUrl.includes("fox") ? "🦊" :
                 user.avatarUrl && user.avatarUrl.includes("lion") ? "🦁" :
                 user.avatarUrl && user.avatarUrl.includes("panda") ? "🐼" :
                 user.avatarUrl && user.avatarUrl.includes("unicorn") ? "🦄" :
                 user.avatarUrl && user.avatarUrl.includes("eagle") ? "🦅" : "📚"}
              </div>

              <h2 className="text-xl font-bold text-zinc-800 tracking-tight">{user.username}</h2>
              <span className="text-[10px] text-violet-750 font-bold bg-violet-600/10 border border-violet-500/10 px-3 py-1 rounded-full mt-1.5 uppercase tracking-widest flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 fill-current text-amber-500" />
                {user.role === 'admin' ? 'Premium (Admin)' : 'Premium Foydalanuvchi'}
              </span>
              
              <p className="text-xs text-zinc-500 mt-4 leading-relaxed font-sans max-w-[280px]">
                {user.bio || "Mutolaaga bo'lgan muhabbat har bir sahifada namoyon bo'ladi."}
              </p>

              <div className="w-full h-px bg-black/5 my-6" />

              <div className="w-full flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Sana: {new Date(user.joinedAt).toLocaleDateString("uz-UZ", { year: 'numeric', month: 'short' })}
                </span>
                <span>ID: {user.id}</span>
              </div>
            </div>
          </div>

          {/* Profile Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-black/5 flex flex-col justify-between h-24">
              <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                Streak (Ketma-ket)
              </span>
              <div>
                <h3 className="text-2xl font-black text-zinc-800 leading-none">{analytics.streak} kun</h3>
              </div>
            </div>
            
            <div className="glass-panel p-4 rounded-2xl border border-black/5 flex flex-col justify-between h-24">
              <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                O'qilgan kitoblar
              </span>
              <div>
                <h3 className="text-2xl font-black text-zinc-800 leading-none">{completedBooksCount} ta</h3>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-black/5 flex flex-col justify-between h-24">
              <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                O'qilgan sahifalar
              </span>
              <div>
                <h3 className="text-2xl font-black text-zinc-800 leading-none">{mockPagesRead} bet</h3>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-black/5 flex flex-col justify-between h-24">
              <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Tinglangan soat
              </span>
              <div>
                <h3 className="text-2xl font-black text-zinc-800 leading-none">{mockListeningHours.toFixed(1)} s</h3>
              </div>
            </div>
          </div>

          {/* Badges & Achievements list */}
          <div className="glass-panel p-5 rounded-3xl border border-black/5">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4">Mukofot va Badjlar</h3>
            <div className="space-y-3">
              {[
                { name: "Kashfiyotchi", desc: "Birinchi kitob mutolaasini boshlang", unlocked: progressList.length > 0 },
                { name: "Mutolaa yulduzi", desc: "Kamida 1 ta kitobni to'liq tugating", unlocked: completedBooksCount > 0 },
                { name: "Kutubxonachi", desc: "Xatcho'plarga 2 ta kitob qo'shing", unlocked: bookmarks.length >= 2 }
              ].map((badge) => (
                <div key={badge.name} className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${
                  badge.unlocked ? "bg-white border-black/5" : "bg-black/[0.02] border-transparent opacity-60"
                }`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    badge.unlocked ? "bg-violet-600/10 text-violet-600" : "bg-zinc-200 text-zinc-400"
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-800">{badge.name}</h4>
                    <p className="text-[10px] text-zinc-500">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Minutes Custom Bar Graph */}
          <div className="glass-panel p-5 rounded-3xl border border-black/5">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4">Haftalik faollik</h3>
            
            <div className="h-44 w-full flex items-end justify-between gap-2.5 pt-4">
              {analytics.weeklyActivity.map((day: any, idx: number) => {
                const heightPercent = (day.minutes / maxChartMinutes) * 100;
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                    <div className="w-full relative flex items-end justify-center h-28">
                      <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-white border border-black/5 text-[9px] text-zinc-800 shadow-md px-1.5 py-0.5 rounded transition-opacity duration-200 pointer-events-none">
                        {day.minutes}m
                      </span>
                      <motion.div
                        className="w-full rounded-t-md bg-gradient-to-t from-violet-600 to-indigo-500"
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                      />
                    </div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Library Navigation, Leaderboard, AI Recs & Payments */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* AI Recommendation Engine */}
          <div className="glass-panel p-6 rounded-[32px] border border-black/5 space-y-4">
            <div className="flex items-center gap-2 text-violet-700">
              <Brain className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest">AI Tavsiyalar</h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              Kayfiyatingiz yoki maqsadlaringizdan birini tanlang va BookVerse sun'iy intellekti sizga eng mos keluvchi kitobni tanlab beradi:
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                { id: "growth", name: "📈 Shaxsiy yuksalish" },
                { id: "biz", name: "💼 Biznes & Startap" },
                { id: "drama", name: "✨ Badiiy Hordiq" }
              ].map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => triggerAiRecommendations(mood.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedMood === mood.id
                      ? "bg-violet-600 border-violet-600 text-white shadow"
                      : "bg-white border-black/5 text-zinc-650 hover:bg-black/2"
                  }`}
                >
                  {mood.name}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {isAiLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 bg-black/2 rounded-2xl flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-violet-300 border-t-violet-600 animate-spin" />
                  <span>AI kutubxonani tahlil qilmoqda...</span>
                </motion.div>
              )}

              {aiRecommendation && !isAiLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-5 bg-violet-600/5 border border-violet-500/10 rounded-2xl flex flex-col sm:flex-row items-center gap-5"
                >
                  <div className="w-20 aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-black/5 shadow-sm">
                    {aiRecommendation.book.coverUrl ? (
                      <img src={aiRecommendation.book.coverUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-tr ${aiRecommendation.book.gradientFrom || "from-violet-600"} ${aiRecommendation.book.gradientTo || "to-cyan-600"} flex items-center justify-center p-2 text-center text-[10px] text-white font-bold leading-tight`}>
                        {aiRecommendation.book.title}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-violet-600 block">AI tavsiyasi</span>
                    <h4 className="text-sm font-bold text-zinc-800">{aiRecommendation.book.title}</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{aiRecommendation.reasoning}</p>
                    <Link
                      href={`/book/${aiRecommendation.book.id}`}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 uppercase tracking-wider pt-1 hover:text-violet-800 transition-colors"
                    >
                      Batafsil ko'rish
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reading Calendar and Leaderboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Reading Calendar */}
            <div className="glass-panel p-5 rounded-3xl border border-black/5">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-violet-600" />
                Mutolaa taqvimi (Iyul)
              </h3>
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold text-zinc-400">
                {["D", "S", "Ch", "P", "J", "Sh", "Y"].map((d) => <span key={d}>{d}</span>)}
                {/* Render 31 days with mock goal status */}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const completed = day === 5 || day === 12 || day === 14 || day === 15 || day === 21;
                  return (
                    <span
                      key={day}
                      className={`h-6 flex items-center justify-center rounded-lg ${
                        completed ? "bg-violet-600 text-white font-bold" : "bg-black/5 text-zinc-600"
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Active Leaderboard */}
            <div className="glass-panel p-5 rounded-3xl border border-black/5">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500 fill-current" />
                Faol kitobxonlar reytingi
              </h3>
              <div className="space-y-2">
                {[
                  { rank: 1, name: "Victor Verse", time: "480 daqiqa" },
                  { rank: 2, name: "Aria Sterling", time: "320 daqiqa" },
                  { rank: 3, name: "Dorian Gray", time: "190 daqiqa" },
                  { rank: 4, name: `${user.username} (Siz)`, time: `${analytics.totalMinutes} daqiqa`, active: true }
                ].map((row) => (
                  <div key={row.name} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    row.active ? "bg-violet-600/5 border-violet-500/10 font-bold" : "bg-white border-black/5"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        row.rank === 1 ? "bg-amber-400 text-amber-950" : row.rank === 2 ? "bg-zinc-300 text-zinc-800" : "bg-black/5 text-zinc-600"
                      }`}>
                        {row.rank}
                      </span>
                      <span className="text-zinc-800">{row.name}</span>
                    </div>
                    <span className="text-zinc-550 font-bold">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Library Tabs (O'qilmoqda / Xatcho'plar / Tugallangan) */}
          <div className="space-y-6">
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
                        : "border-transparent text-zinc-550 hover:text-zinc-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Cards List Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-[300px]">
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
                  <div className="col-span-2 py-16 text-center text-zinc-550 flex flex-col items-center justify-center gap-3">
                    <BookMarked className="w-10 h-10 text-zinc-400" />
                    <p className="text-sm">Ushbu ruknda kitob topilmadi.</p>
                    <Link
                      href="/"
                      className="px-4.5 py-2 rounded-xl border border-black/10 hover:border-violet-500 hover:text-violet-750 text-xs font-semibold transition-all mt-2"
                    >
                      Katalogga o'tish
                    </Link>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Payment & Obunalar history tab panel */}
          <div className="glass-panel p-6 rounded-3xl border border-black/5 space-y-6">
            <div className="flex items-center gap-2 text-violet-700">
              <CreditCard className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Obuna va To'lovlar tarixi</h3>
            </div>

            {/* Promo Code Input panel */}
            <form onSubmit={handleValidatePromo} className="bg-black/3 p-4 rounded-2xl border border-black/5 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full text-left">
                <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block mb-1">Promo-kod faollashtirish</span>
                <input
                  type="text"
                  placeholder="Promo-kodni kiriting (masalan: BOOKVERSE2026)..."
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-white px-3.5 py-2 text-xs rounded-xl border border-black/5 focus:outline-none focus:border-violet-500 font-sans"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer shadow mt-4 sm:mt-0"
              >
                Tasdiqlash
              </button>
            </form>

            {promoMessage && (
              <p className={`text-xs font-bold ${promoSuccess ? "text-emerald-600" : "text-rose-600"}`}>
                {promoMessage}
              </p>
            )}

            {/* Payment history list */}
            <div className="space-y-3">
              <h4 className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">To'lov tranzaksiyalari logi</h4>
              <div className="divide-y divide-black/5 border border-black/5 rounded-2xl overflow-hidden bg-white">
                {payments.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-zinc-800">{p.sum}</span>
                      <span className="text-[10px] text-zinc-500 block">Sana: {p.date} • Turi: {p.method}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-bold uppercase text-[9px] tracking-wider">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Edit Profile & Avatar modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
            
            <motion.div
              className="w-full max-w-md bg-[#FAF8F5] glass-panel p-8 rounded-3xl border border-black/5 z-10 max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-6 border-b border-black/5 pb-3">
                <h3 className="text-lg font-bold text-zinc-800">Profilni tahrirlash</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-full hover:bg-black/5 text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-zinc-550 uppercase tracking-widest block mb-2">Foydalanuvchi nomi</label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-zinc-805 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-550 uppercase tracking-widest block mb-2">Profil rasmi (Avatar tanlash)</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {AVATAR_GRADIENTS.map((avatar) => (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatarId(avatar.id)}
                        className={`p-3 rounded-xl border text-xs text-left font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          selectedAvatarId === avatar.id
                            ? "bg-violet-600/10 border-violet-500 text-violet-750"
                            : "bg-white border-black/5 text-zinc-650 hover:bg-black/2"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${avatar.style} flex items-center justify-center text-[10px]`}>
                          {avatar.id === "owl" ? "🦉" :
                           avatar.id === "fox" ? "🦊" :
                           avatar.id === "lion" ? "🦁" :
                           avatar.id === "panda" ? "🐼" :
                           avatar.id === "unicorn" ? "🦄" : "🦅"}
                        </div>
                        {avatar.name.split(" ")[1]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-550 uppercase tracking-widest block mb-2">Mutolaa maqsadi / Tarjimai hol</label>
                  <textarea
                    rows={3}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-zinc-805 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all resize-none font-sans"
                    placeholder="O'zingiz haqingizda yozing..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-xs text-white shadow-xl shadow-violet-600/10 transition-all cursor-pointer uppercase tracking-wider"
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
