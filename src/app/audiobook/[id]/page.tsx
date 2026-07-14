"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookVerseDB, Book } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Download,
  Clock,
  Gauge,
  ListMusic,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X,
  VolumeX,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AudiobookPlayerPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  // Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [duration, setDuration] = useState(1200); // 20 minutes mock
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);

  // Sleep Timer States
  const [sleepTimeLeft, setSleepTimeLeft] = useState<number | null>(null); // in seconds
  const [activeSleepTimer, setActiveSleepTimer] = useState<number | null>(null); // nominal minutes

  // Modals & UI States
  const [showChapters, setShowChapters] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Audio simulation timer ref
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sleepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadedBook = BookVerseDB.getBookById(bookId);
    if (!loadedBook || !loadedBook.audiobook) {
      router.push("/");
      return;
    }
    setBook(loadedBook);
    
    // Parse seeded audio duration
    if (loadedBook.audioDuration) {
      const minutes = parseInt(loadedBook.audioDuration, 10);
      if (!isNaN(minutes)) {
        setDuration(minutes * 60);
      }
    }
    setLoading(false);
  }, [bookId, router]);

  // Audio Playback Simulation
  useEffect(() => {
    if (isPlaying) {
      audioIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const nextVal = prev + 1 * playbackSpeed;
          if (nextVal >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return nextVal;
        });
      }, 1000);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }

    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlaying, playbackSpeed, duration]);

  // Sleep Timer countdown
  useEffect(() => {
    if (sleepTimeLeft !== null && sleepTimeLeft > 0) {
      sleepIntervalRef.current = setInterval(() => {
        setSleepTimeLeft((prev) => {
          if (prev !== null && prev <= 1) {
            setIsPlaying(false); // Pause audio
            setActiveSleepTimer(null);
            if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    } else {
      if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);
    }

    return () => {
      if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);
    };
  }, [sleepTimeLeft]);

  if (loading || !book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  // Format seconds to MM:SS
  const formatSecs = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSkip = (seconds: number) => {
    setCurrentTime((prev) => {
      const nextTime = prev + seconds;
      return Math.max(0, Math.min(duration, nextTime));
    });
  };

  const handleProgressScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.floor(pct * duration));
  };

  const handleSleepTimerSetup = (minutes: number) => {
    setActiveSleepTimer(minutes);
    setSleepTimeLeft(minutes * 60);
  };

  const cancelSleepTimer = () => {
    setActiveSleepTimer(null);
    setSleepTimeLeft(null);
  };

  const handleDownloadAudio = () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    // Simulate Premium restriction
    if (user.role !== "admin" && book.premium) {
      setShowUpgradeModal(true);
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    const downloadInterval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(downloadInterval);
          setIsDownloading(false);
          setDownloadSuccess(true);
          confetti({ particleCount: 50, spread: 30 });
          setTimeout(() => setDownloadSuccess(false), 3000);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const progressPercent = (currentTime / duration) * 100;

  return (
    <div className="min-h-screen bg-transparent relative pb-24">
      {/* Background abstract layout */}
      <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-200/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-200/10 blur-[130px] pointer-events-none" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 flex flex-col items-center">
        
        {/* Top bar back link */}
        <div className="w-full max-w-xl flex items-center justify-between mb-8">
          <Link
            href={`/book/${book.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kitob sahifasiga qaytish
          </Link>
          <button
            onClick={() => setShowChapters(true)}
            className="p-2 rounded-xl bg-black/5 hover:bg-black/8 text-zinc-700 cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <ListMusic className="w-4 h-4" />
            Boblar
          </button>
        </div>

        {/* Player Box Container */}
        <div className="w-full max-w-xl glass-panel p-8 sm:p-12 rounded-[40px] border border-black/5 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
          
          {/* Subtle spinning vinyl or cover disk */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <div className={`w-full h-full rounded-full border border-black/5 overflow-hidden shadow-2xl relative flex items-center justify-center transition-transform duration-1000 ${
              isPlaying ? "animate-spin" : ""
            }`} style={{ animationDuration: "12s" }}>
              
              {/* Vinyl lines texture */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.03)_50%,transparent_55%)] pointer-events-none" />
              
              {book.coverUrl ? (
                <img src={book.coverUrl} className="w-full h-full object-cover rounded-fullScale scale-95" alt="" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-tr ${book.gradientFrom || "from-violet-600"} ${book.gradientTo || "to-cyan-600"} scale-95 rounded-full`} />
              )}
              {/* Center hole spindle */}
              <div className="absolute w-8 h-8 rounded-full bg-[#FAF8F5] border border-black/5 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-850" />
              </div>
            </div>

            {/* Glowing active audiobook badge */}
            <div className="absolute -bottom-2 right-4 w-9 h-9 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/25">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Book Info text */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-violet-600 block">
              Bob: {book.chapters[currentChapterIdx]?.title || "Mundarija"}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 line-clamp-1">{book.title}</h2>
            <p className="text-xs text-zinc-550 font-medium">{book.author}</p>
          </div>

          {/* Scrubbable Progress Bar */}
          <div className="w-full space-y-2">
            <div
              className="h-1.5 w-full bg-black/5 rounded-full relative overflow-hidden cursor-pointer group"
              onClick={handleProgressScrub}
            >
              <div
                className="h-full bg-violet-600 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Scrub hook pin */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-violet-750 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-bold">
              <span>{formatSecs(currentTime)}</span>
              <span>{formatSecs(duration)}</span>
            </div>
          </div>

          {/* Control Buttons panel */}
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            {/* Speed adjustments */}
            <div className="relative group">
              <button
                className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/8 text-zinc-650 flex items-center justify-center transition-all cursor-pointer"
                title="Tezlik sozlamalari"
              >
                <Gauge className="w-4 h-4" />
              </button>
              {/* Dropdown overlay */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-white border border-black/5 p-2 rounded-2xl shadow-xl z-20 w-24">
                {[0.5, 1.0, 1.25, 1.5, 2.0, 3.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold ${
                      playbackSpeed === spd ? "bg-violet-600 text-white" : "hover:bg-black/5 text-zinc-600"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Skip back 15s */}
            <button
              onClick={() => handleSkip(-15)}
              className="w-11 h-11 rounded-full bg-black/5 hover:bg-black/8 text-zinc-650 flex items-center justify-center transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Main Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/20 hover:scale-105 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
            </button>

            {/* Skip forward 30s */}
            <button
              onClick={() => handleSkip(30)}
              className="w-11 h-11 rounded-full bg-black/5 hover:bg-black/8 text-zinc-650 flex items-center justify-center transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Sleep Timer */}
            <div className="relative group">
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeSleepTimer ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "bg-black/5 hover:bg-black/8 text-zinc-650"
                }`}
                title="Kuyish vaqtini o'chirish taymeri (Sleep Timer)"
              >
                <Clock className="w-4 h-4" />
              </button>
              {/* Dropdown menu */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-white border border-black/5 p-2 rounded-2xl shadow-xl z-20 w-32">
                {activeSleepTimer && (
                  <button
                    onClick={cancelSleepTimer}
                    className="py-1.5 text-left px-2 rounded-lg text-[9px] font-bold text-rose-600 hover:bg-rose-50"
                  >
                    O'chirish ({formatSecs(sleepTimeLeft || 0)})
                  </button>
                )}
                {[10, 20, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSleepTimerSetup(mins)}
                    className={`py-1.5 text-left px-2 rounded-lg text-[10px] font-medium ${
                      activeSleepTimer === mins ? "bg-indigo-600 text-white" : "hover:bg-black/5 text-zinc-650"
                    }`}
                  >
                    {mins} daqiqa
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Volume control panel */}
          <div className="flex items-center gap-3 w-48 mx-auto pt-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseInt(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-full h-1 bg-black/5 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
          </div>

          {/* Offline Download button section */}
          <div className="w-full border-t border-black/5 pt-6 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Ijro tezligi</span>
              <span className="text-xs font-bold text-zinc-700">{playbackSpeed}x tezlik</span>
            </div>

            {isDownloading ? (
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <div className="w-4 h-4 rounded-full border-2 border-zinc-300 border-t-zinc-500 animate-spin" />
                <span>Yuklanmoqda {downloadProgress}%</span>
              </div>
            ) : downloadSuccess ? (
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Oflayn tayyor!
              </div>
            ) : (
              <button
                onClick={handleDownloadAudio}
                className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/8 text-zinc-750 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Oflayn yuklab olish
              </button>
            )}
          </div>

        </div>

      </main>

      {/* Chapters list bottom sheet popup */}
      <AnimatePresence>
        {showChapters && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowChapters(false)} />
            
            <motion.div
              className="w-full max-w-md bg-[#FAF8F5] glass-panel p-6 rounded-t-3xl sm:rounded-3xl border border-black/5 z-10 max-h-[80vh] flex flex-col"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
            >
              <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
                <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">Mundarija / Boblar</h3>
                <button
                  onClick={() => setShowChapters(false)}
                  className="p-1 rounded-full hover:bg-black/5 text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-black/5">
                {book.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setCurrentChapterIdx(idx);
                      setCurrentTime(0);
                      setIsPlaying(true);
                      setShowChapters(false);
                    }}
                    className={`w-full py-4 text-left flex items-center justify-between hover:bg-black/2 px-2 transition-all rounded-xl ${
                      currentChapterIdx === idx ? "bg-violet-600/5 font-bold" : ""
                    }`}
                  >
                    <span className="text-xs text-zinc-800 leading-snug">{ch.title}</span>
                    {currentChapterIdx === idx && (
                      <span className="text-[10px] text-violet-600 uppercase font-bold tracking-wider">Tinglanmoqda</span>
                    )}
                  </button>
                ))}
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
                  Audio fayllarni yuklab olish imkoniyati faqat BookVerse Premium obunachilariga taqdim etiladi.
                </p>
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
                    confetti({ particleCount: 50, spread: 30 });
                  }}
                  className="py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow shadow-violet-600/10 cursor-pointer"
                >
                  Premiumga o'tish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
