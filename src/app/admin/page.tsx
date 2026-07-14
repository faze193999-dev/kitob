"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { BookVerseDB, Book, Review } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle,
  XCircle,
  FileText,
  Settings,
  X,
  CreditCard,
  MessageSquare,
  Award,
  Crown,
  Eye,
  Star,
  Check,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function AdminPage() {
  const { user, loading } = useAuth();
  
  // Navigation Tabs: 'analytics' | 'books' | 'users' | 'payments' | 'moderation'
  const [activeTab, setActiveTab] = useState<"analytics" | "books" | "users" | "payments" | "moderation">("analytics");
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<any>(null);

  // New Book Dialog states
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("Texnologiya");
  const [newDescription, setNewDescription] = useState("");
  const [newReadTime, setNewReadTime] = useState("20 daqiqa");
  const [newChaptersContent, setNewChaptersContent] = useState("");
  
  // Custom Author dialog states
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [authorsList, setAuthorsList] = useState([
    { id: "auth-1", name: "Alexis Vance", booksCount: 3, rating: 4.9 },
    { id: "auth-2", name: "Julian Vance", booksCount: 2, rating: 4.8 },
    { id: "auth-3", name: "F. Scott Fitzgerald", booksCount: 1, rating: 4.7 }
  ]);

  // File parsing states
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [parsedChapters, setParsedChapters] = useState<{ title: string; content: string }[]>([]);

  // Users management states
  const [usersList, setUsersList] = useState([
    { id: "bv-user-1", username: "Aria Sterling", email: "reader@bookverse.com", role: "user", joined: "2026-01-15", status: "Premium" },
    { id: "bv-user-2", username: "Dorian Gray", email: "dorian@gray.com", role: "user", joined: "2026-03-04", status: "Premium" },
    { id: "bv-user-3", username: "Elena Rostova", email: "elena@rostova.org", role: "user", joined: "2026-02-19", status: "Free" },
    { id: "bv-admin-1", username: "Victor Verse", email: "admin@bookverse.com", role: "admin", joined: "2025-10-01", status: "Premium" }
  ]);

  // Reviews Moderation list states
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [moderatedReviewId, setModeratedReviewId] = useState<string | null>(null);

  // Mock Payments List
  const [paymentsLog, setPaymentsLog] = useState([
    { id: "pay-501", user: "Aria Sterling", sum: "19,000 UZS", method: "Click", date: "2026-07-14", status: "Muvaffaqiyatli" },
    { id: "pay-502", user: "Dorian Gray", sum: "19,000 UZS", method: "Payme", date: "2026-07-13", status: "Muvaffaqiyatli" },
    { id: "pay-503", user: "Elena Rostova", sum: "19,000 UZS", method: "Uzcard", date: "2026-07-10", status: "Muvaffaqiyatli" }
  ]);

  useEffect(() => {
    setBooks(BookVerseDB.getBooks());
    setStats(BookVerseDB.getPlatformStats());
    
    // Fetch all reviews for moderation
    const booksList = BookVerseDB.getBooks();
    const reviewsArr: Review[] = [];
    booksList.forEach((b) => {
      const bookReviews = BookVerseDB.getReviews(b.id);
      reviewsArr.push(...bookReviews);
    });
    setAllReviews(reviewsArr);
  }, []);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;

    const finalChapters = parsedChapters.length > 0 ? parsedChapters : [
      {
        id: 1,
        title: "1-bob: Kirish",
        content: newChaptersContent || `Bu - "${newTitle}" kitobining 1-bobi. Tizimli o'qish kontenti BookVerse kutubxonasida tezda taqdim etiladi.`
      }
    ];

    BookVerseDB.addBook({
      title: newTitle,
      author: newAuthor,
      category: newCategory,
      coverUrl: "",
      description: newDescription || "Tavsif kiritilmagan.",
      readTime: newReadTime,
      chapters: finalChapters.map((ch, idx) => ({ id: idx + 1, ...ch })),
      publishedYear: new Date().getFullYear(),
      gradientFrom: "from-violet-600",
      gradientTo: "to-cyan-600",
      premium: false,
      audiobook: false,
      editorsChoice: false,
      todaysPick: false,
      recommended: true
    });

    setBooks(BookVerseDB.getBooks());
    setStats(BookVerseDB.getPlatformStats());
    setIsAddingBook(false);
    
    // Reset Dialog inputs
    setNewTitle("");
    setNewAuthor("");
    setNewDescription("");
    setNewChaptersContent("");
    setUploadedFileName("");
    setParsedChapters([]);
    confetti({ particleCount: 50, spread: 35 });
  };

  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) return;

    setAuthorsList((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: authorName,
        booksCount: 1,
        rating: 5.0
      }
    ]);
    setAuthorName("");
    setAuthorBio("");
    setIsAddingAuthor(false);
    confetti({ particleCount: 40, spread: 20 });
  };

  const handleDeleteBook = (id: string) => {
    BookVerseDB.deleteBook(id);
    setBooks(BookVerseDB.getBooks());
    setStats(BookVerseDB.getPlatformStats());
  };

  const toggleSubscriptionStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "Premium" ? "Free" : "Premium";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleToggleMarketingTag = (bookId: string, field: "premium" | "audiobook" | "editorsChoice" | "todaysPick" | "recommended") => {
    const book = BookVerseDB.getBookById(bookId);
    if (!book) return;

    // Toggle field value
    book[field] = !book[field] as any;
    
    // If setting todaysPick: ensure only one book is todaysPick
    if (field === "todaysPick" && book[field]) {
      const allBooks = BookVerseDB.getBooks();
      allBooks.forEach((b) => {
        if (b.id !== book.id) {
          b.todaysPick = false;
          BookVerseDB.updateBook(b);
        }
      });
    }

    BookVerseDB.updateBook(book);
    setBooks(BookVerseDB.getBooks());
    confetti({ particleCount: 30, spread: 20 });
  };

  const handleReviewApprove = (reviewId: string) => {
    setModeratedReviewId(reviewId);
    setTimeout(() => {
      setModeratedReviewId(null);
      // Remove review trigger or tasdiqlash mock
      confetti({ particleCount: 30, spread: 20 });
    }, 1000);
  };

  const handleReviewDelete = (reviewId: string) => {
    setAllReviews((prev) => prev.filter((r) => r.id !== reviewId));
    // Remove from localStorage
    try {
      const saved = localStorage.getItem("bv_reviews");
      if (saved) {
        const parsed: Review[] = JSON.parse(saved);
        const filtered = parsed.filter((r) => r.id !== reviewId);
        localStorage.setItem("bv_reviews", JSON.stringify(filtered));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Drag Drop Parser trigger
  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) triggerFileParsing(file.name);
  };

  const triggerFileParsing = (fileName: string) => {
    setUploadedFileName(fileName);
    setIsParsing(true);
    setParseProgress(0);

    const interval = setInterval(() => {
      setParseProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsParsing(false);
          setParsedChapters([
            {
              title: "1-bob: Hujjatdan parcha",
              content: `Ushbu bob "${fileName}" hujjatidan muvaffaqiyatli tahlil qilindi.\n\nBookVerse metama'lumotlarni olish moduli format sarlavhalarini tekshirdi, tizimli chekinishlarni tekshirdi va matn bloklarini katalogladi. Tahlil qilingan paragraflar Medium/Kindle o'qish qulayligi mezonlariga to'liq mos keladi. Yoqimli mutolaa tilaymiz.`
            }
          ]);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  // Security Check: Restrict view
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <XCircle className="w-16 h-16 text-rose-500 mb-6" />
        <h2 className="text-2xl font-bold text-zinc-800 mb-2">Kirish taqiqlangan</h2>
        <p className="text-zinc-500 text-sm max-w-sm mb-6">Ushbu sahifaga kirish uchun administrator ruxsatingiz bo'lishi kerak.</p>
        <Link href="/" className="px-5 py-3 rounded-2xl bg-black/5 border border-black/5 text-zinc-700 font-semibold text-sm hover:bg-black/8 hover:text-zinc-950 transition-all">
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  const maxRevenue = stats ? Math.max(...stats.monthlyRevenue.map((m: any) => m.amount), 5000) : 10000;

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6">
        
        {/* Portal Title header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-black/5 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800 tracking-tight leading-none">Boshqaruv paneli</h1>
            <p className="text-zinc-505 text-xs mt-2">Kutubxona kitoblari, to'lovlar, kategoriyalar va sharhlarni moderatsiya qilish</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "analytics", name: "Tahlillar" },
              { id: "books", name: "Katalog" },
              { id: "users", name: "Obunachilar" },
              { id: "payments", name: "To'lovlar" },
              { id: "moderation", name: "Moderatsiya" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white shadow"
                    : "bg-black/5 text-zinc-500 hover:text-zinc-950"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Analytics platform telemetry */}
        {activeTab === "analytics" && stats && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-5 rounded-2xl border border-black/5">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block mb-2">Jami daromad</span>
                <div className="flex items-baseline gap-1 text-zinc-805">
                  <DollarSign className="w-4 h-4 text-violet-600" />
                  <span className="text-2xl font-bold">{stats.currentRevenue.toLocaleString()} UZS</span>
                </div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-black/5">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block mb-2">Mutolaalar soni</span>
                <div className="flex items-baseline gap-1 text-zinc-805">
                  <BookOpen className="w-4 h-4 text-indigo-650" />
                  <span className="text-2xl font-bold">{stats.totalViews.toLocaleString()} marta</span>
                </div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-black/5">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block mb-2">Ro'yxatdan o'tganlar</span>
                <div className="flex items-baseline gap-1 text-zinc-805">
                  <Users className="w-4 h-4 text-cyan-650" />
                  <span className="text-2xl font-bold">{stats.totalReaders.toLocaleString()} ta</span>
                </div>
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-black/5">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block mb-2">Faol kitoblar</span>
                <div className="flex items-baseline gap-1 text-zinc-805">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span className="text-2xl font-bold">{stats.totalBooks} dona</span>
                </div>
              </div>
            </div>

            {/* Area chart telemetry */}
            <div className="glass-panel p-6 rounded-3xl border border-black/5">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-6">Yillik daromad grafigi</h3>
              <div className="h-64 w-full flex items-end justify-between gap-6 pt-4 relative">
                <div className="absolute inset-x-0 bottom-[25%] h-px bg-black/5 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-[50%] h-px bg-black/5 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-[75%] h-px bg-black/5 pointer-events-none" />

                {stats.monthlyRevenue.map((month: any, idx: number) => {
                  const heightPercent = (month.amount / maxRevenue) * 100;
                  return (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                      <div className="w-full relative flex items-end justify-center h-48">
                        <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-white border border-black/5 text-[9px] text-zinc-800 shadow px-1.5 py-0.5 rounded transition-all pointer-events-none">
                          {month.amount.toLocaleString()} UZS
                        </span>
                        <motion.div
                          className="w-full rounded-t-xl bg-gradient-to-t from-violet-650/10 to-violet-600 border-t border-violet-500"
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 1, delay: idx * 0.08 }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">{month.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Books & Categories & Banners */}
        {activeTab === "books" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Authors and Actions top row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-800">Kitoblar va Mualliflar ro'yxati ({books.length})</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsAddingAuthor(true)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Yangi muallif
                </button>
                <button
                  onClick={() => setIsAddingBook(true)}
                  className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Yangi kitob
                </button>
              </div>
            </div>

            {/* Banners & Recommendations Tagging Table */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-black/5 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-black/5 bg-black/2 text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                      <th className="p-4">Nomi va muallifi</th>
                      <th className="p-4">Janr</th>
                      <th className="p-4 text-center">Banners/Marking tag boshqaruvi</th>
                      <th className="p-4 text-right">O'chirish</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {books.map((b) => (
                      <tr key={b.id} className="hover:bg-black/[0.01]">
                        <td className="p-4">
                          <p className="font-bold text-zinc-800">{b.title}</p>
                          <p className="text-zinc-550 text-[10px]">by {b.author}</p>
                        </td>
                        <td className="p-4 font-semibold text-zinc-600">{b.category}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            {[
                              { field: "premium", label: "👑 Premium" },
                              { field: "audiobook", label: "🎧 Audio" },
                              { field: "editorsChoice", label: "✍️ Muharrir" },
                              { field: "todaysPick", label: "📅 Kun tanlovi" }
                            ].map((tag) => {
                              const isActive = b[tag.field as keyof Book];
                              return (
                                <button
                                  key={tag.field}
                                  onClick={() => handleToggleMarketingTag(b.id, tag.field as any)}
                                  className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                                    isActive
                                      ? "bg-violet-600/10 border-violet-500/20 text-violet-700"
                                      : "bg-white border-black/5 text-zinc-400"
                                  }`}
                                >
                                  {tag.label}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteBook(b.id)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/25 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Users Database & Active Subscriptions controller */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-zinc-800 border-b border-black/5 pb-4">Foydalanuvchi ma'lumotlar bazasi ({usersList.length})</h2>
            
            <div className="glass-panel rounded-3xl overflow-hidden border border-black/5 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-black/5 bg-black/2 text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                      <th className="p-4">Foydalanuvchi</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Roli</th>
                      <th className="p-4">Qo'shilgan sana</th>
                      <th className="p-4 text-center">Obuna holati (Free / Premium)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 font-sans">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-black/[0.01]">
                        <td className="p-4 font-bold text-zinc-805">{u.username}</td>
                        <td className="p-4 text-zinc-500">{u.email}</td>
                        <td className="p-4 font-bold uppercase tracking-wider text-[10px] text-zinc-650">{u.role}</td>
                        <td className="p-4 text-zinc-500">{u.joined}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => toggleSubscriptionStatus(u.id)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                              u.status === "Premium"
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-700"
                                : "bg-zinc-100 border-black/5 text-zinc-550"
                            }`}
                          >
                            {u.status === "Premium" ? "👑 Premium" : "Bepul / Oddiy"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Payments logs */}
        {activeTab === "payments" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-zinc-800 border-b border-black/5 pb-4">Tranzaksiyalar va To'lovlar logi</h2>
            
            <div className="glass-panel rounded-3xl overflow-hidden border border-black/5 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-black/5 bg-black/2 text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                      <th className="p-4">Foydalanuvchi</th>
                      <th className="p-4">Tranzaksiya Summasi</th>
                      <th className="p-4">To'lov tizimi</th>
                      <th className="p-4">Sana</th>
                      <th className="p-4 text-right">Holat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 font-sans">
                    {paymentsLog.map((p) => (
                      <tr key={p.id} className="hover:bg-black/[0.01]">
                        <td className="p-4 font-bold text-zinc-805">{p.user}</td>
                        <td className="p-4 font-bold text-zinc-700">{p.sum}</td>
                        <td className="p-4 font-semibold text-zinc-550">{p.method}</td>
                        <td className="p-4 text-zinc-500">{p.date}</td>
                        <td className="p-4 text-right">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-bold uppercase text-[9px] tracking-wider">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Reviews Moderation */}
        {activeTab === "moderation" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold text-zinc-800 border-b border-black/5 pb-4">Sharhlarni Moderatsiya qilish ({allReviews.length})</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {allReviews.length > 0 ? (
                allReviews.map((rev) => (
                  <div key={rev.id} className="glass-panel p-5 rounded-2xl border border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-800 text-xs">{rev.username}</span>
                        <span className="text-[10px] text-zinc-400 font-bold">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? "text-amber-500 fill-current" : "text-zinc-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed font-sans">{rev.text}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleReviewApprove(rev.id)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                          moderatedReviewId === rev.id
                            ? "bg-emerald-500 text-white"
                            : "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
                        }`}
                      >
                        {moderatedReviewId === rev.id ? <Check className="w-3.5 h-3.5" /> : null}
                        {moderatedReviewId === rev.id ? "Tasdiqlandi" : "Tasdiqlash"}
                      </button>
                      <button
                        onClick={() => handleReviewDelete(rev.id)}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        O'chirish
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-zinc-400 text-xs font-medium">
                  Hozircha tekshirilishi kerak bo'lgan yangi sharhlar mavjud emas.
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Add New Book Modal */}
      <AnimatePresence>
        {isAddingBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddingBook(false)} />
            
            <motion.div
              className="w-full max-w-2xl bg-[#FAF8F5] glass-panel p-6 sm:p-8 rounded-3xl border border-black/5 z-10 my-auto flex flex-col max-h-[85vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-6">
                <h3 className="text-base font-bold text-zinc-800 uppercase tracking-widest">Yangi kitob qo'shish</h3>
                <button
                  onClick={() => setIsAddingBook(false)}
                  className="p-1 rounded-full hover:bg-black/5 text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* EPUB/PDF drag drop parser section */}
              <div
                onDragOver={handleDropFile}
                onDrop={handleDropFile}
                className="mb-6 p-6 rounded-2xl border-2 border-dashed border-black/10 hover:border-violet-500 transition-colors text-center cursor-pointer relative"
              >
                <input
                  type="file"
                  accept=".pdf,.epub"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) triggerFileParsing(file.name);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-zinc-700">PDF yoki EPUB faylni sudrab keling</h4>
                <p className="text-[10px] text-zinc-400 mt-1">Avtomatik boblarni ajratish va tahlil qilish uchun</p>
                {uploadedFileName && (
                  <div className="mt-3 p-2 rounded-xl bg-violet-600/5 text-violet-700 text-xs font-bold inline-flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    {uploadedFileName}
                  </div>
                )}
              </div>

              <form onSubmit={handleAddBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Kitob nomi</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-black/5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Muallif</label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-black/5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Kategoriya</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-black/5 text-xs text-zinc-800 focus:outline-none focus:border-violet-500 focus:bg-white transition-all font-sans"
                    >
                      <option value="Texnologiya">Texnologiya</option>
                      <option value="Biznes">Biznes</option>
                      <option value="Shaxsiy rivojlanish">Shaxsiy rivojlanish</option>
                      <option value="Badiiy adabiyot">Badiiy adabiyot</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">O'qish davomiyligi</label>
                    <input
                      type="text"
                      value={newReadTime}
                      onChange={(e) => setNewReadTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-black/5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Qisqacha tavsif</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-black/5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all resize-none font-sans"
                  />
                </div>

                {parsedChapters.length === 0 && (
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Kitob 1-bob matni</label>
                    <textarea
                      rows={4}
                      value={newChaptersContent}
                      onChange={(e) => setNewChaptersContent(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-black/5 text-xs text-zinc-800 placeholder-zinc-450 focus:outline-none focus:border-violet-500 focus:bg-white transition-all resize-none font-sans"
                      placeholder="Kitob boblarini qo'lda yozing..."
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-xs text-white shadow-xl shadow-violet-600/10 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Kitobni saqlash
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Author Modal */}
      <AnimatePresence>
        {isAddingAuthor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddingAuthor(false)} />
            
            <motion.div
              className="w-full max-w-md bg-[#FAF8F5] glass-panel p-6 sm:p-8 rounded-3xl border border-black/5 z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-5">
                <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-widest">Yangi muallif qo'shish</h3>
                <button
                  onClick={() => setIsAddingAuthor(false)}
                  className="p-1 rounded-full hover:bg-black/5 text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAuthor} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Muallif ismi</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-black/5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all font-sans"
                    placeholder="Masalan: Alisher Navoiy..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Biografiyasi</label>
                  <textarea
                    rows={3}
                    value={authorBio}
                    onChange={(e) => setAuthorBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/5 border border-black/5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-violet-500 focus:bg-white transition-all resize-none font-sans"
                    placeholder="Muallif haqida qisqacha ma'lumot kiriting..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-xs text-white shadow transition-all cursor-pointer uppercase tracking-wider"
                >
                  Saqlash
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
