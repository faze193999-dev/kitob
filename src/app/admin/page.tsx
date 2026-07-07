"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { BookVerseDB, Book } from "@/lib/db";
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
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminPage() {
  const { user, loading } = useAuth();
  
  // Tabs: 'analytics' | 'books' | 'users'
  const [activeTab, setActiveTab] = useState<"analytics" | "books" | "users">("analytics");
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<any>(null);

  // New Book Dialog
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("Texnologiya");
  const [newDescription, setNewDescription] = useState("");
  const [newReadTime, setNewReadTime] = useState("20 daqiqa");
  const [newChaptersContent, setNewChaptersContent] = useState("");

  // File Upload states
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [parsedChapters, setParsedChapters] = useState<{ title: string; content: string }[]>([]);

  // Mock Users List
  const [usersList, setUsersList] = useState([
    { id: "bv-user-1", username: "Aria Sterling", email: "reader@bookverse.com", role: "user", joined: "2026-01-15" },
    { id: "bv-user-2", username: "Dorian Gray", email: "dorian@gray.com", role: "user", joined: "2026-03-04" },
    { id: "bv-user-3", username: "Elena Rostova", email: "elena@rostova.org", role: "user", joined: "2026-02-19" },
    { id: "bv-admin-1", username: "Victor Verse", email: "admin@bookverse.com", role: "admin", joined: "2025-10-01" }
  ]);

  useEffect(() => {
    setBooks(BookVerseDB.getBooks());
    setStats(BookVerseDB.getPlatformStats());
  }, []);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;

    // Use default chapters or parsed files
    const finalChapters = parsedChapters.length > 0 ? parsedChapters : [
      {
        id: 1,
        title: "1-bob: Kirish",
        content: newChaptersContent || `Bu - "${newTitle}" kitobining 1-bobi. Tizimli o'qish kontenti BookVerse kutubxonasida tezda taqdim etiladi.`
      }
    ];

    const added = BookVerseDB.addBook({
      title: newTitle,
      author: newAuthor,
      category: newCategory,
      coverUrl: "", // Defaults to modern CSS gradients
      description: newDescription || "Tavsif kiritilmagan.",
      readTime: newReadTime,
      chapters: finalChapters.map((ch, idx) => ({ id: idx + 1, ...ch })),
      publishedYear: new Date().getFullYear(),
      gradientFrom: "from-violet-600",
      gradientTo: "to-cyan-600"
    });

    // Refresh lists
    setBooks(BookVerseDB.getBooks());
    setStats(BookVerseDB.getPlatformStats());
    
    // Reset Dialog
    setIsAddingBook(false);
    setNewTitle("");
    setNewAuthor("");
    setNewDescription("");
    setNewChaptersContent("");
    setUploadedFileName("");
    setParsedChapters([]);
  };

  const handleDeleteBook = (id: string) => {
    BookVerseDB.deleteBook(id);
    setBooks(BookVerseDB.getBooks());
    setStats(BookVerseDB.getPlatformStats());
  };

  const handleRoleToggle = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextRole = u.role === "admin" ? "user" : "admin";
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  // Mock PDF/EPUB Parser Simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      triggerFileParsing(file.name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerFileParsing(file.name);
    }
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
          
          // Generate mocked parsed chapters based on filename
          setParsedChapters([
            {
              title: "1-bob: Hujjatdan parcha",
              content: `Ushbu bob "${fileName}" hujjatidan muvaffaqiyatli tahlil qilindi.\n\nBookVerse metama'lumotlarni olish moduli format sarlavhalarini tekshirdi, tizimli chekinishlarni tekshirdi va matn bloklarini katalogladi. Tahlil qilingan paragraflar Medium/Kindle o'qish qulayligi mezonlariga to'liq mos keladi. Yoqimli mutolaa tilaymiz.`
            },
            {
              title: "2-bob: A ilova",
              content: "Hujjat yakunidan olingan qo'shimcha ma'lumotlar, qaydlar va kontent segmentlari."
            }
          ]);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Security Check: Restrict Access
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <XCircle className="w-16 h-16 text-rose-500 mb-6" />
        <h2 className="text-2xl font-bold text-zinc-800 mb-2">Kirish taqiqlangan</h2>
        <p className="text-zinc-500 text-sm max-w-sm mb-6">
          Ushbu sahifaga kirish uchun administrator ruxsatingiz bo'lishi kerak.
        </p>
        <Link href="/" className="px-5 py-3 rounded-2xl bg-black/5 border border-black/5 text-zinc-700 font-semibold text-sm hover:bg-black/8 hover:text-zinc-950 transition-all">
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  // Find max revenue for scaling chart
  const maxRevenue = stats ? Math.max(...stats.monthlyRevenue.map((m: any) => m.amount), 5000) : 10000;

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6">
        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-800 tracking-tight leading-none">Boshqaruv paneli</h1>
            <p className="text-zinc-500 text-sm mt-2">Kutubxona kitoblari, foydalanuvchilar va metrika telemetriyasini boshqarish</p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "analytics", name: "Tahlillar" },
              { id: "books", name: "Kitoblar" },
              { id: "users", name: "Foydalanuvchilar" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/10"
                    : "bg-black/5 text-zinc-500 border border-transparent hover:text-zinc-950"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Analytics Dashboard */}
        {activeTab === "analytics" && stats && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-5 rounded-2xl border border-black/5">
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider block mb-2">Jami daromad</span>
                <div className="flex items-baseline gap-1 text-zinc-800">
                  <DollarSign className="w-5 h-5 text-violet-600" />
                  <span className="text-3xl font-bold">{stats.currentRevenue.toLocaleString()}</span>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-black/5">
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider block mb-2">Mutolaalar soni</span>
                <div className="flex items-baseline gap-1 text-zinc-800">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</span>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-black/5">
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider block mb-2">Ro'yxatdan o'tganlar</span>
                <div className="flex items-baseline gap-1 text-zinc-800">
                  <Users className="w-5 h-5 text-cyan-600" />
                  <span className="text-3xl font-bold">{stats.totalReaders.toLocaleString()}</span>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-black/5">
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider block mb-2">Faol kitoblar</span>
                <div className="flex items-baseline gap-1 text-zinc-800">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="text-3xl font-bold">{stats.totalBooks}</span>
                </div>
              </div>
            </div>

            {/* Revenue Telemetry Area Chart (SVG Custom Chart) */}
            <div className="glass-panel p-6 rounded-3xl border border-black/5">
              <h3 className="text-sm font-bold text-zinc-800 mb-6">Daromad o'sishi telemetriyasi</h3>
              
              <div className="h-64 w-full flex items-end justify-between gap-6 pt-4 relative">
                {/* Horizontal baseline grids */}
                <div className="absolute inset-x-0 bottom-[25%] h-px bg-black/5 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-[50%] h-px bg-black/5 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-[75%] h-px bg-black/5 pointer-events-none" />

                {stats.monthlyRevenue.map((month: any, idx: number) => {
                  const heightPercent = (month.amount / maxRevenue) * 100;
                  return (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                      <div className="w-full relative flex items-end justify-center h-48">
                        <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-white border border-black/5 text-[10px] text-zinc-800 shadow-md px-2 py-0.5 rounded transition-all pointer-events-none">
                          ${month.amount}
                        </span>
                        
                        <motion.div
                          className="w-full rounded-t-xl bg-gradient-to-t from-violet-600/10 to-violet-600 border-t border-violet-500"
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 1, delay: idx * 0.08 }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 font-semibold uppercase">{month.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Books */}
        {activeTab === "books" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <h2 className="text-xl font-bold text-zinc-800">Kutubxona kitoblari katalogi ({books.length})</h2>
              <button
                onClick={() => setIsAddingBook(true)}
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-violet-600/10 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Yangi kitob qo'shish
              </button>
            </div>

            <div className="glass-panel rounded-3xl overflow-hidden border border-black/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-black/5 bg-black/3">
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Nomi va muallifi</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Turkum</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Ko'rishlar</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Reyting</th>
                      <th className="p-4 font-bold text-zinc-500 text-center uppercase tracking-widest text-[10px]">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id} className="border-b border-black/5 hover:bg-black/2 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-11 rounded bg-zinc-100 border border-black/5 flex-shrink-0 overflow-hidden relative">
                              {book.coverUrl ? (
                                <img src={book.coverUrl} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-tr ${book.gradientFrom || "from-violet-600"} ${book.gradientTo || "to-cyan-600"}`} />
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-zinc-800">{book.title}</h4>
                              <p className="text-xs text-zinc-500">{book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-black/5 border border-black/5 text-xs text-zinc-500 font-medium">
                            {book.category}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-600 font-medium">{book.views.toLocaleString()}</td>
                        <td className="p-4 text-zinc-600 font-medium">{book.rating}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                              title="Kitobni o'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Users & Scopes */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="border-b border-black/5 pb-4">
              <h2 className="text-xl font-bold text-zinc-800 font-sans">Foydalanuvchilar ro'yxati</h2>
            </div>

            <div className="glass-panel rounded-3xl overflow-hidden border border-black/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-black/5 bg-black/3">
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Foydalanuvchi profili</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">E-pochta manzili</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Qo'shilgan sana</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Ruxsat roli</th>
                      <th className="p-4 font-bold text-zinc-500 text-center uppercase tracking-widest text-[10px]">Rolni o'zgartirish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((usr) => (
                      <tr key={usr.id} className="border-b border-black/5 hover:bg-black/2 transition-colors">
                        <td className="p-4">
                          <h4 className="font-bold text-zinc-800">{usr.username}</h4>
                          <span className="text-[10px] text-zinc-500">ID: {usr.id}</span>
                        </td>
                        <td className="p-4 text-zinc-600 font-sans">{usr.email}</td>
                        <td className="p-4 text-zinc-500 text-xs font-medium">{usr.joined}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            usr.role === "admin"
                              ? "bg-violet-600/10 text-violet-700 border border-violet-500/10"
                              : "bg-black/5 text-zinc-500 border border-black/5"
                          }`}>
                            {usr.role === "admin" ? "Admin" : "Foydalanuvchi"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleRoleToggle(usr.id)}
                              disabled={usr.id === user.id} // Disable toggle self role
                              className={`p-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                                usr.id === user.id
                                  ? "opacity-30 cursor-not-allowed text-zinc-600 border-transparent"
                                  : "bg-black/5 border-black/5 text-zinc-500 hover:bg-black/8 hover:text-zinc-950"
                              }`}
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Book Dialog Overlay */}
      <AnimatePresence>
        {isAddingBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-12">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddingBook(false)} />

            <motion.div
              className="w-full max-w-2xl glass-panel p-8 rounded-3xl border border-black/5 z-10 my-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-zinc-800">Yangi kitob qo'shish</h3>
                <button
                  onClick={() => setIsAddingBook(false)}
                  className="p-1 rounded-full hover:bg-black/5 text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddBook} className="space-y-5">
                {/* Drag-Drop EPUB / PDF Parser Widget */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDropFile}
                  className="p-6 rounded-2xl border border-dashed border-black/5 bg-black/2 hover:bg-black/4 transition-colors flex flex-col items-center justify-center text-center cursor-pointer relative"
                >
                  <input
                    type="file"
                    accept=".pdf,.epub,.txt"
                    onChange={handleFileInput}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-violet-600 mb-2" />
                  {isParsing ? (
                    <div className="w-full max-w-xs space-y-2">
                      <div className="flex justify-between text-xs text-zinc-500 font-semibold">
                        <span>Hujjat matni tahlil qilinmoqda...</span>
                        <span>{parseProgress}%</span>
                      </div>
                      <div className="h-1 bg-black/5 w-full rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 transition-all duration-300" style={{ width: `${parseProgress}%` }} />
                      </div>
                    </div>
                  ) : uploadedFileName ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-600/10 px-3 py-1.5 rounded-full">
                      <FileText className="w-4 h-4" />
                      Muvaffaqiyatli tahlil qilindi: {uploadedFileName}
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-zinc-600 font-semibold">EPUB yoki PDF formatdagi kitobingizni bu yerga tortib olib keling</p>
                      <p className="text-[10px] text-zinc-500 mt-1">yoki faylni tanlash uchun bosing (.pdf, .epub, .txt)</p>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Kitob nomi</label>
                    <input
                      type="text"
                      required
                      placeholder="masalan: Al-Kimyogar"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-zinc-800 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:bg-white/80"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Muallif ismi</label>
                    <input
                      type="text"
                      required
                      placeholder="masalan: O'tkir Hoshimov"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-zinc-800 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:bg-white/80"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Janr / Turkum</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/5 text-zinc-800 text-sm focus:outline-none focus:border-violet-500"
                    >
                      {["Texnologiya", "Biznes", "Shaxsiy rivojlanish", "Badiiy adabiyot", "Ilm-fan"].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Mutolaa vaqti</label>
                    <input
                      type="text"
                      placeholder="masalan: 25 daqiqa"
                      value={newReadTime}
                      onChange={(e) => setNewReadTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-zinc-800 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:bg-white/80"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Kitobning qisqacha tavsifi</label>
                  <textarea
                    rows={2}
                    placeholder="Kitob haqida qisqacha ma'lumot..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-zinc-800 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 resize-none font-sans focus:bg-white/80"
                  />
                </div>

                {parsedChapters.length === 0 && (
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Bob mazmuni</label>
                    <textarea
                      rows={4}
                      placeholder="O'qiladigan boblarni yaratish uchun matnni bu yerga kiriting..."
                      value={newChaptersContent}
                      onChange={(e) => setNewChaptersContent(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-zinc-800 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 resize-none font-sans focus:bg-white/80"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-sm text-white shadow-xl shadow-violet-600/10 transition-all cursor-pointer mt-4"
                >
                  Kitobni saqlash
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
