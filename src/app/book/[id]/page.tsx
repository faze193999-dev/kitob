"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookVerseDB, Book, Review } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import {
  Star,
  BookOpen,
  Headphones,
  Download,
  Share2,
  Heart,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Layers,
  Globe,
  Award,
  Play,
  Pause,
  X,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal / Playback States
  const [showSample, setShowSample] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(30); // Simulated percentage
  const [shareStatus, setShareStatus] = useState(false);

  // Review Form States
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const loadedBook = BookVerseDB.getBookById(bookId);
    if (!loadedBook) {
      router.push("/");
      return;
    }
    setBook(loadedBook);
    setReviews(BookVerseDB.getReviews(bookId));

    if (user) {
      const favs = BookVerseDB.getFavorites(user.id);
      setIsFavorite(favs.includes(bookId));
    }
    setLoading(false);
  }, [bookId, user, router]);

  if (loading || !book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  // Derived properties
  const mockPageCount = book.chapters.length * 24 + 140;
  const mockLanguage = book.category === "Badiiy adabiyot" ? "O'zbekcha / Inglizcha" : "O'zbekcha";

  const handleFavoriteToggle = () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    const added = BookVerseDB.toggleFavorite(user.id, book.id);
    setIsFavorite(added);
    
    // Confetti on adding to favorites
    if (added) {
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 },
        colors: ["#ec4899", "#8b5cf6"]
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareStatus(true);
    setTimeout(() => setShareStatus(false), 2000);
  };

  const handleDownload = () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    // Check premium (we can simulate premium role check; if user.role is 'admin' or they are premium)
    if (user.role === "admin" || book.premium === false) {
      // Trigger simulated file download
      const element = document.createElement("a");
      const file = new Blob([`${book.title} - ${book.author} (BookVerse Premium Download)`], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${book.id}_bookverse_download.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess(false);

    if (!user) {
      router.push("/auth");
      return;
    }

    if (!newReviewText.trim()) {
      setReviewError("Sharh matnini kiriting.");
      return;
    }

    try {
      const addedReview = BookVerseDB.addReview({
        userId: user.id,
        username: user.username,
        bookId: book.id,
        rating: newRating,
        text: newReviewText
      });

      // Refresh reviews list and book rating
      setReviews(BookVerseDB.getReviews(book.id));
      const updatedBook = BookVerseDB.getBookById(book.id);
      if (updatedBook) setBook(updatedBook);

      setNewReviewText("");
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError("Sharh qo'shishda xatolik yuz berdi.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative pb-32">
      {/* Background ambient orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-orange-200/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-violet-200/10 blur-[130px] pointer-events-none" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Book Cover & Quick Action Buttons */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-stretch space-y-6">
            <div className="w-56 sm:w-64 lg:w-full aspect-[3/4] rounded-3xl bg-zinc-100 border border-black/5 overflow-hidden relative shadow-lg mx-auto group">
              {book.coverUrl ? (
                <img src={book.coverUrl} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" alt="" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-tr ${book.gradientFrom || "from-violet-600"} ${book.gradientTo || "to-cyan-600"} group-hover:scale-103 transition-transform duration-500`} />
              )}

              {/* Format overlay badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {book.premium ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow">
                    <Crown className="w-3 h-3 fill-current" />
                    Premium
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow">
                    Bepul
                  </span>
                )}
              </div>
            </div>

            {/* Book Metadata Quick stats */}
            <div className="w-full grid grid-cols-3 gap-3 text-center">
              <div className="glass-panel p-3.5 rounded-2xl border border-black/5">
                <Globe className="w-4 h-4 text-violet-600 mx-auto mb-1.5" />
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Til</span>
                <span className="text-xs font-bold text-zinc-800 line-clamp-1 mt-0.5">{mockLanguage}</span>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl border border-black/5">
                <Layers className="w-4 h-4 text-violet-600 mx-auto mb-1.5" />
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Sahifalar</span>
                <span className="text-xs font-bold text-zinc-800 block mt-0.5">{mockPageCount}</span>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl border border-black/5">
                <Calendar className="w-4 h-4 text-violet-600 mx-auto mb-1.5" />
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Nashr yili</span>
                <span className="text-xs font-bold text-zinc-800 block mt-0.5">{book.publishedYear}</span>
              </div>
            </div>

            {/* Actions list */}
            <div className="w-full space-y-3.5 pt-2">
              <Link
                href={`/reader/${book.id}`}
                className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-xl shadow-violet-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <BookOpen className="w-4.5 h-4.5" />
                O'qishni boshlash
              </Link>

              <button
                onClick={() => setShowSample(true)}
                className="w-full py-4 rounded-2xl bg-black/5 hover:bg-black/8 text-zinc-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Namuna o'qish
              </button>

              {book.audiobook && (
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isPlayingAudio
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/10"
                      : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                  }`}
                >
                  <Headphones className="w-4.5 h-4.5" />
                  {isPlayingAudio ? "Audioni to'xtatish" : "Audiokitobni tinglash"}
                </button>
              )}

              <button
                onClick={handleDownload}
                className="w-full py-4 rounded-2xl bg-zinc-500/5 hover:bg-zinc-500/10 border border-black/5 text-zinc-600 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4.5 h-4.5" />
                Yuklab olish (Premium)
              </button>

              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <button
                  onClick={handleFavoriteToggle}
                  className={`py-3.5 rounded-xl border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isFavorite
                      ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                      : "bg-white border-black/5 text-zinc-600 hover:bg-black/3"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Sevimlilarda" : "Sevimlilarga"}
                </button>
                <button
                  onClick={handleShare}
                  className="py-3.5 rounded-xl bg-white border border-black/5 hover:bg-black/3 text-zinc-600 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  {shareStatus ? "Nusxalandi!" : "Ulashish"}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Title, Metadata, Description, Table of Contents, Reviews */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Book Meta Details */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/10 text-violet-700 text-xs font-semibold">
                  {book.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium ml-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-zinc-800 font-bold">{book.rating}</span>
                  <span>({reviews.length} sharh)</span>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold font-sans text-zinc-800 tracking-tight leading-tight">
                  {book.title}
                </h1>
                <p className="text-base text-zinc-500 font-medium">Muallif: <span className="text-zinc-700 font-bold">{book.author}</span></p>
              </div>
            </div>

            {/* Description (Tavsif) */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-black/5 space-y-4">
              <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-widest">Qisqacha tavsif</h3>
              <p className="text-zinc-600 text-sm leading-relaxed font-sans">{book.description}</p>
            </div>

            {/* Table of Contents (Mundarija) */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-widest border-b border-black/5 pb-3">Kitob mundarijasi</h3>
              <div className="divide-y divide-black/5 bg-white rounded-3xl border border-black/5 overflow-hidden">
                {book.chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/reader/${book.id}?chapter=${chapter.id}`}
                    className="p-5 flex items-center justify-between hover:bg-black/2 transition-colors duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-violet-600/10 text-violet-600 flex items-center justify-center text-xs font-bold font-sans">
                        {chapter.id}
                      </span>
                      <span className="text-sm font-bold text-zinc-800 group-hover:text-violet-750 transition-colors">
                        {chapter.title}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Reviews (Sharhlar) */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-widest border-b border-black/5 pb-3">Kitobxonlar sharhlari ({reviews.length})</h3>

              {/* Review Input Box */}
              {user ? (
                <form onSubmit={handleAddReview} className="glass-panel p-6 rounded-3xl border border-black/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-700">O'z reytingingizni belgilang:</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-0.5 focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating ? "text-amber-500 fill-current" : "text-zinc-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Ushbu asar haqida o'z fikringizni yozib qoldiring..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-black/5 border border-black/5 text-zinc-800 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:bg-white/80 resize-none font-sans transition-all"
                  />

                  {reviewError && (
                    <p className="text-rose-600 text-xs font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {reviewError}
                    </p>
                  )}

                  {reviewSuccess && (
                    <p className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Sharhingiz muvaffaqiyatli qo'shildi!
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow shadow-violet-600/10 transition-all cursor-pointer"
                    >
                      Sharh yuborish
                    </button>
                  </div>
                </form>
              ) : (
                <div className="glass-panel p-5 rounded-2xl border border-black/5 text-center text-zinc-500 text-xs">
                  Sharh yozish uchun iltimos <Link href="/auth" className="text-violet-600 font-bold hover:underline">tizimga kiring</Link>.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev.id} className="glass-panel p-5 rounded-2xl border border-black/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-800">{rev.username}</span>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= rev.rating ? "text-amber-500 fill-current" : "text-zinc-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-semibold ml-1">
                            {new Date(rev.createdAt).toLocaleDateString("uz-UZ")}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed font-sans">{rev.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-zinc-400 text-xs">
                    Ushbu kitobga hali sharhlar yozilmagan. Birinchi bo'lib o'z fikringizni bildiring!
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Floating Audio Playback Widget at Bottom */}
      <AnimatePresence>
        {isPlayingAudio && (
          <motion.div
            className="fixed bottom-6 inset-x-6 z-40 max-w-xl mx-auto glass-panel p-4 rounded-2xl border border-indigo-100 shadow-2xl flex items-center justify-between gap-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-zinc-800 truncate">{book.title} (Audio)</h4>
                <p className="text-[10px] text-zinc-500 truncate">by {book.author}</p>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 max-w-[180px]">
              <span className="text-[9px] text-zinc-400 font-bold">1:20</span>
              <div className="h-1 bg-black/5 flex-1 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                setAudioProgress(pct);
              }}>
                <div className="h-full bg-indigo-600" style={{ width: `${audioProgress}%` }} />
              </div>
              <span className="text-[9px] text-zinc-400 font-bold">{book.audioDuration || "20m"}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingAudio(false)}
                className="p-1 rounded-full hover:bg-black/5 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Sample Reading Modal */}
      <AnimatePresence>
        {showSample && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSample(false)} />
            
            <motion.div
              className="w-full max-w-2xl bg-[#FAF8F5] glass-panel p-6 sm:p-8 rounded-3xl border border-black/5 z-10 my-auto flex flex-col max-h-[85vh]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-violet-600 block">Namuna o'qish</span>
                  <h3 className="text-lg font-bold text-zinc-800 truncate">{book.title} — 1-bob</h3>
                </div>
                <button
                  onClick={() => setShowSample(false)}
                  className="p-1.5 rounded-full hover:bg-black/5 text-zinc-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-serif text-sm leading-relaxed text-zinc-700">
                <h4 className="font-bold text-base text-zinc-800">{book.chapters[0]?.title || "1-bob"}</h4>
                <p className="whitespace-pre-line">{book.chapters[0]?.content || "Namuna matni taqdim etilmagan."}</p>
              </div>

              <div className="border-t border-black/5 pt-4 mt-6 flex items-center justify-between">
                <span className="text-xs text-zinc-500">Namuna tugadi. Kitobning to'liq versiyasini o'qing.</span>
                <Link
                  href={`/reader/${book.id}`}
                  className="px-4.5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow shadow-violet-600/10 transition-all cursor-pointer"
                >
                  To'liq o'qish
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upgrade Subscription Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
            
            <motion.div
              className="w-full max-w-md glass-panel p-8 rounded-3xl border border-black/5 z-10 text-center space-y-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Crown className="w-6 h-6 fill-current" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-800">Premium obuna talab etiladi</h3>
                <p className="text-zinc-500 text-xs leading-relaxed max-w-xs mx-auto">
                  Ushbu kitobni yuklab olish faqat BookVerse Premium a'zolari uchun ruxsat etilgan. Hozir a'zolikni yangilang!
                </p>
              </div>

              <div className="bg-black/3 p-4 rounded-2xl border border-black/5 text-left space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600 font-semibold">Premium a'zolik:</span>
                  <span className="font-bold text-zinc-800">19,000 UZS / oy</span>
                </div>
                <div className="h-px bg-black/5" />
                <ul className="text-[10px] text-zinc-500 space-y-1.5 list-disc list-inside">
                  <li>Barcha premium kitoblarni to'liq o'qish</li>
                  <li>Oflayn o'qish uchun PDF/EPUB yuklab olish</li>
                  <li>Cheksiz audiokitoblarni tinglash imkoni</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="py-3 rounded-xl border border-black/5 hover:bg-black/3 text-zinc-600 text-xs font-semibold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    // Upgrade mock toast
                    confetti({
                      particleCount: 80,
                      spread: 60,
                      origin: { y: 0.6 }
                    });
                  }}
                  className="py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow shadow-violet-600/10 cursor-pointer"
                >
                  Obunani faollashtirish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
