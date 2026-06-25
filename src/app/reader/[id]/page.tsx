"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookVerseDB, Book, Highlight, Note, Bookmark, Chapter } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronLeft,
  Settings2,
  Maximize2,
  Minimize2,
  Bookmark as BookmarkIcon,
  BookmarkCheck,
  Plus,
  Trash2,
  Menu,
  X,
  Type,
  AlignLeft,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReaderPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;
  const router = useRouter();
  const { user, updateUserPreferences } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  // Layout states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [annotationsOpen, setAnnotationsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reading Options (bound to AuthContext preferences / local state)
  const [fontSize, setFontSize] = useState(18);
  const [fontFamily, setFontFamily] = useState<"sans" | "serif" | "mono">("sans");
  const [theme, setTheme] = useState<"dark" | "light" | "sepia" | "glass">("dark");

  // Selection & Annotation states
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [textPopoverPosition, setTextPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState("");

  const [scrollProgress, setScrollProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync user preferences
  useEffect(() => {
    if (user?.preferences) {
      setFontSize(user.preferences.fontSize || 18);
      setFontFamily(user.preferences.fontFamily || "sans");
      setTheme(user.preferences.theme || "dark");
    }
  }, [user]);

  // Load Book data
  useEffect(() => {
    const loadedBook = BookVerseDB.getBookById(bookId);
    if (!loadedBook) {
      router.push("/");
      return;
    }
    setBook(loadedBook);

    // Load progress
    if (user) {
      const progress = BookVerseDB.getProgressForBook(user.id, bookId);
      if (progress) {
        // Chapters are 1-indexed, match index
        const idx = loadedBook.chapters.findIndex((c) => c.id === progress.currentChapter);
        if (idx !== -1) {
          setCurrentChapterIdx(idx);
        }
      }
      
      // Load user annotations
      setHighlights(BookVerseDB.getHighlights(user.id, bookId));
      setNotes(BookVerseDB.getNotes(user.id, bookId));
    }
    setLoading(false);
  }, [bookId, user, router]);

  // Handle Theme class mapping on mount/change
  useEffect(() => {
    const body = document.body;
    body.classList.remove("light-theme", "sepia-theme");
    if (theme === "light") body.classList.add("light-theme");
    if (theme === "sepia") body.classList.add("sepia-theme");
  }, [theme]);

  // Scroll Progress Calculator
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);

    // Auto-save reading progress
    if (user && book) {
      const chapterId = book.chapters[currentChapterIdx].id;
      // Increment 1 minute on first deep scroll progress, then normal scroll tracking
      BookVerseDB.saveProgress(user.id, book.id, progress, chapterId, 1);

      if (progress >= 99.5) {
        // Celebrating 100% completion
        triggerCelebration();
      }
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#8b5cf6", "#3b82f6", "#10b981", "#ec4899"]
    });
  };

  // Fullscreen management
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // Handle text selection for highlights
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setTextPopoverPosition(null);
      return;
    }

    const text = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelectedText(text);
    setSelectionRange(range);
    
    // Position popover relative to selection
    setTextPopoverPosition({
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top - 50 + window.scrollY
    });
  };

  const createHighlight = (color: string) => {
    if (!user || !book || !selectedText) return;
    const chapterId = book.chapters[currentChapterIdx].id;

    BookVerseDB.saveHighlight({
      userId: user.id,
      bookId: book.id,
      chapterId,
      text: selectedText,
      color
    });

    setHighlights(BookVerseDB.getHighlights(user.id, book.id));
    setTextPopoverPosition(null);
    window.getSelection()?.removeAllRanges();
  };

  const createNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !book || !selectedText || !noteInput.trim()) return;
    const chapterId = book.chapters[currentChapterIdx].id;

    BookVerseDB.saveNote({
      userId: user.id,
      bookId: book.id,
      chapterId,
      text: noteInput,
      highlightText: selectedText
    });

    setNotes(BookVerseDB.getNotes(user.id, book.id));
    setNoteInput("");
    setTextPopoverPosition(null);
    window.getSelection()?.removeAllRanges();
  };

  const deleteHighlight = (id: string) => {
    BookVerseDB.deleteHighlight(id);
    if (book && user) setHighlights(BookVerseDB.getHighlights(user.id, book.id));
  };

  const deleteNote = (id: string) => {
    BookVerseDB.deleteNote(id);
    if (book && user) setNotes(BookVerseDB.getNotes(user.id, book.id));
  };

  // Bookmark Chapter
  const toggleBookmark = () => {
    if (!user || !book) return;
    const chapterId = book.chapters[currentChapterIdx].id;
    
    const userBookmarks = BookVerseDB.getBookmarks(user.id);
    const existing = userBookmarks.find((b) => b.bookId === book.id && b.chapterId === chapterId);

    if (existing) {
      BookVerseDB.deleteBookmark(existing.id);
    } else {
      BookVerseDB.saveBookmark({
        userId: user.id,
        bookId: book.id,
        chapterId,
        scrollPosition: scrollProgress,
        percentage: scrollProgress
      });
    }
    // Forces context/UI update
    setBook({ ...book });
  };

  const isChapterBookmarked = () => {
    if (!user || !book) return false;
    const chapterId = book.chapters[currentChapterIdx].id;
    return BookVerseDB.getBookmarks(user.id).some((b) => b.bookId === book.id && b.chapterId === chapterId);
  };

  // Highlighting parser implementation
  const renderHighlightedContent = (rawText: string) => {
    if (highlights.length === 0) return rawText;

    let html = rawText;
    // Map current chapter highlights
    const chapterHighlights = highlights.filter(
      (h) => h.chapterId === book?.chapters[currentChapterIdx].id
    );

    // Sort descending to prevent sub-string collision replacement
    chapterHighlights
      .sort((a, b) => b.text.length - a.text.length)
      .forEach((h) => {
        const escaped = h.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const regex = new RegExp(`(${escaped})`, "gi");

        let highlightClass = "bg-yellow-500/20 text-inherit border-b-2 border-yellow-500/60";
        if (h.color === "green") highlightClass = "bg-emerald-500/20 text-inherit border-b-2 border-emerald-500/60";
        if (h.color === "blue") highlightClass = "bg-cyan-500/20 text-inherit border-b-2 border-cyan-500/60";
        if (h.color === "pink") highlightClass = "bg-pink-500/20 text-inherit border-b-2 border-pink-500/60";

        html = html.replace(regex, `<span class="${highlightClass}">${h.text}</span>`);
      });

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  if (loading || !book) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
          <p className="text-zinc-500 text-sm font-medium animate-pulse">BookVerse mutolaa interfeysi yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const currentChapter = book.chapters[currentChapterIdx];

  // Font typography classes mapping
  const fontClass =
    fontFamily === "serif" ? "font-serif" : fontFamily === "mono" ? "font-mono" : "font-sans";

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-all duration-300 ${
      theme === "light" 
        ? "bg-[#fafafa] text-[#09090b]" 
        : theme === "sepia" 
        ? "bg-[#f4ecd8] text-[#433422]" 
        : "bg-[#050508] text-[#f4f4f5]"
    }`}>
      {/* Top Header Panel */}
      <header className={`h-16 px-6 border-b flex items-center justify-between z-20 ${
        theme === "light" 
          ? "bg-white/80 border-black/5" 
          : theme === "sepia" 
          ? "bg-[#fcf6e8]/80 border-[#433422]/10" 
          : "bg-[#09090c]/80 border-white/5"
      } backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              theme === "light" ? "hover:bg-black/5" : "hover:bg-white/5"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold truncate max-w-[200px] sm:max-w-[400px]">
              {book.title}
            </h1>
            <p className="text-xs text-zinc-500">muallif: {book.author}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Chapter Drawer Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl cursor-pointer ${
              sidebarOpen ? "bg-violet-500/10 text-violet-500" : "hover:bg-white/5"
            }`}
            title="Boblar ro'yxati"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Bookmark toggle */}
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-xl cursor-pointer ${
              isChapterBookmarked() ? "text-violet-500" : "hover:bg-white/5"
            }`}
            title="Bobni xatcho'plarga qo'shish"
          >
            {isChapterBookmarked() ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <BookmarkIcon className="w-5 h-5" />
            )}
          </button>

          {/* User Annotations drawer */}
          <button
            onClick={() => setAnnotationsOpen(!annotationsOpen)}
            className={`p-2 rounded-xl cursor-pointer ${
              annotationsOpen ? "bg-violet-500/10 text-violet-500" : "hover:bg-white/5"
            }`}
            title="Mening belgilashlarim va qaydlarim"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* Settings panel toggle */}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`p-2 rounded-xl cursor-pointer ${
              settingsOpen ? "bg-violet-500/10 text-violet-500" : "hover:bg-white/5"
            }`}
            title="Mutolaa sozlamalari"
          >
            <Settings2 className="w-5 h-5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl hover:bg-white/5 hidden sm:block cursor-pointer"
            title={isFullscreen ? "To'liq ekrandan chiqish" : "To'liq ekran"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Progress Bar indicator */}
      <div className="h-[3px] w-full bg-white/5 z-20">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Panel Canvas Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Chapters Left Sidebar Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <div className="fixed inset-0 bg-black/40 z-20" onClick={() => setSidebarOpen(false)} />
              <motion.aside
                className="absolute left-0 top-0 bottom-0 w-80 bg-[#09090c] border-r border-white/5 z-30 p-6 flex flex-col justify-between"
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-white">Mundarija</h3>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1 rounded-full hover:bg-white/5 text-zinc-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {book.chapters.map((ch, idx) => {
                      const isActive = currentChapterIdx === idx;
                      return (
                        <button
                          key={ch.id}
                          onClick={() => {
                            setCurrentChapterIdx(idx);
                            setScrollProgress(0);
                            if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                            setSidebarOpen(false);
                          }}
                          className={`w-full p-4 rounded-2xl text-left cursor-pointer transition-all ${
                            isActive
                              ? "bg-violet-600/10 border border-violet-500 text-white font-semibold"
                              : "bg-white/5 border border-transparent text-zinc-400 hover:text-white hover:bg-white/8"
                          }`}
                        >
                          {ch.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                  <span>Muallif: {book.author}</span>
                  <span>{book.chapters.length} ta bob</span>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Text Selection Highlight Popover */}
        <AnimatePresence>
          {textPopoverPosition && (
            <motion.div
              className="absolute z-50 glass-panel p-2.5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-2 pointer-events-auto"
              style={{
                top: `${textPopoverPosition.y}px`,
                left: `${textPopoverPosition.x}px`,
                transform: "translate(-50%, -100%)"
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center gap-1.5 border-r border-white/10 pr-2">
                <button
                  onClick={() => createHighlight("yellow")}
                  className="w-5 h-5 rounded-full bg-yellow-400 hover:scale-110 transition-transform cursor-pointer"
                  title="Sariq bilan belgilash"
                />
                <button
                  onClick={() => createHighlight("green")}
                  className="w-5 h-5 rounded-full bg-emerald-400 hover:scale-110 transition-transform cursor-pointer"
                  title="Yashil bilan belgilash"
                />
                <button
                  onClick={() => createHighlight("blue")}
                  className="w-5 h-5 rounded-full bg-cyan-400 hover:scale-110 transition-transform cursor-pointer"
                  title="Moviy bilan belgilash"
                />
                <button
                  onClick={() => createHighlight("pink")}
                  className="w-5 h-5 rounded-full bg-pink-400 hover:scale-110 transition-transform cursor-pointer"
                  title="Pushti bilan belgilash"
                />
              </div>

              {/* Quick Note input */}
              <form onSubmit={createNote} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Qayd qo'shish..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-28 py-1 px-1.5"
                />
                <button
                  type="submit"
                  className="p-1 rounded bg-violet-600 text-white hover:bg-violet-500 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Main Reader Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseUp={handleTextSelection}
          className={`flex-1 overflow-y-auto px-6 py-12 scroll-smooth relative z-10 ${
            theme === "glass" ? "bg-[#050508]/40 backdrop-blur-xl" : ""
          }`}
        >
          {theme === "glass" && (
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
              <div className="absolute top-[15%] left-[10%] w-[400px] h-[400px] rounded-full bg-violet-600/20 blur-[120px] animate-float-slow" />
              <div className="absolute bottom-[25%] right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[150px] animate-float-medium" />
            </div>
          )}
          <div className="max-w-[700px] mx-auto relative z-10">
            {/* Header info inside reader */}
            <div className="mb-12 border-b border-zinc-500/10 pb-8 text-center sm:text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase font-bold tracking-widest text-violet-400">
                  {book.category}
                </span>
                <span className="text-xs text-zinc-500 font-semibold">{book.readTime} mutolaa vaqti</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2 leading-tight">
                {currentChapter.title}
              </h2>
              <p className="text-sm text-zinc-500 mt-2">muallif: {book.author}</p>
            </div>

            {/* Reading Content */}
            <article
              ref={articleRef}
              className={`leading-relaxed ${fontClass} max-w-none`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: "1.8",
                letterSpacing: "-0.011em"
              }}
            >
              {currentChapter.content.split(/\n\n+/).map((para, pIdx) => {
                const isFirst = pIdx === 0;
                
                // Align text color with active reader theme
                let paragraphColorClass = theme === "light" 
                  ? "text-zinc-800" 
                  : theme === "sepia" 
                  ? "text-[#433422]" 
                  : "text-zinc-300";
                  
                return (
                  <p
                    key={pIdx}
                    className={`mb-6 text-justify sm:text-left leading-relaxed ${paragraphColorClass} ${
                      isFirst
                        ? "first-letter:text-5xl first-letter:font-bold first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-[var(--primary)] first-letter:leading-none"
                        : ""
                    }`}
                  >
                    {renderHighlightedContent(para)}
                  </p>
                );
              })}
            </article>

            {/* Chapter Navigation footer inside reader */}
            <div className="flex items-center justify-between border-t border-zinc-500/10 mt-16 pt-8">
              <button
                disabled={currentChapterIdx === 0}
                onClick={() => {
                  setCurrentChapterIdx((prev) => prev - 1);
                  setScrollProgress(0);
                  if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-semibold cursor-pointer transition-all ${
                  currentChapterIdx === 0
                    ? "opacity-30 cursor-not-allowed border-transparent text-zinc-600"
                    : "bg-white/5 border-white/5 text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Oldingi bob
              </button>

              <button
                disabled={currentChapterIdx === book.chapters.length - 1}
                onClick={() => {
                  setCurrentChapterIdx((prev) => prev + 1);
                  setScrollProgress(0);
                  if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-semibold cursor-pointer transition-all ${
                  currentChapterIdx === book.chapters.length - 1
                    ? "opacity-30 cursor-not-allowed border-transparent text-zinc-600"
                    : "bg-violet-600 border-violet-500 text-white hover:bg-violet-500 shadow-xl shadow-violet-500/10"
                }`}
              >
                Keyingi bob
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Preferences Drawer Panel */}
        <AnimatePresence>
          {settingsOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setSettingsOpen(false)} />
              <motion.aside
                className="absolute right-0 top-0 bottom-0 w-80 bg-[#09090c] border-l border-white/5 z-30 p-6"
                initial={{ x: 320 }}
                animate={{ x: 0 }}
                exit={{ x: 320 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-white">Ko'rinish sozlamalari</h3>
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="p-1 rounded-full hover:bg-white/5 text-zinc-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Theme Adjuster */}
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Mavzu</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "dark", name: "Tungi", bg: "bg-[#09090c] text-white border-white/10" },
                        { id: "light", name: "Yorug'", bg: "bg-[#fafafa] text-zinc-900 border-black/5" },
                        { id: "sepia", name: "Sepiya", bg: "bg-[#f4ecd8] text-[#433422] border-[#433422]/10" },
                        { id: "glass", name: "Oyna", bg: "bg-gradient-to-tr from-slate-900 to-indigo-950 text-white border-white/10" }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id as any);
                            updateUserPreferences({ theme: t.id as any });
                          }}
                          className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer text-center transition-all ${t.bg} ${
                            theme === t.id ? "ring-2 ring-violet-500" : ""
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Family Adjuster */}
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Shrift uslubi</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "sans", name: "Sans" },
                        { id: "serif", name: "Serif" },
                        { id: "mono", name: "Mono" }
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setFontFamily(f.id as any);
                            updateUserPreferences({ fontFamily: f.id as any });
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer text-center transition-all ${
                            fontFamily === f.id
                              ? "bg-violet-600/10 border-violet-500 text-white"
                              : "bg-white/5 border-transparent text-zinc-400 hover:text-white"
                          }`}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size Adjuster */}
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex justify-between">
                      <span>Shrift hajmi</span>
                      <span className="text-zinc-400 font-bold">{fontSize}px</span>
                    </h4>
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={() => {
                          const size = Math.max(14, fontSize - 2);
                          setFontSize(size);
                          updateUserPreferences({ fontSize: size });
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-300 font-bold hover:bg-white/10 hover:text-white cursor-pointer"
                      >
                        A-
                      </button>
                      <button
                        onClick={() => {
                          const size = Math.min(28, fontSize + 2);
                          setFontSize(size);
                          updateUserPreferences({ fontSize: size });
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-300 font-bold hover:bg-white/10 hover:text-white cursor-pointer"
                      >
                        A+
                      </button>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Right Annotations (Highlights & Notes) Drawer Panel */}
        <AnimatePresence>
          {annotationsOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setAnnotationsOpen(false)} />
              <motion.aside
                className="absolute right-0 top-0 bottom-0 w-80 bg-[#09090c] border-l border-white/5 z-30 p-6 flex flex-col justify-between"
                initial={{ x: 320 }}
                animate={{ x: 0 }}
                exit={{ x: 320 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-white">Mening qaydlarim</h3>
                    <button
                      onClick={() => setAnnotationsOpen(false)}
                      className="p-1 rounded-full hover:bg-white/5 text-zinc-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Highlights section */}
                  <div className="mb-6 max-h-[300px] overflow-y-auto pr-1">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                      Belgilashlar ({highlights.length})
                    </h4>
                    {highlights.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic">Belgilashlar yaratish uchun matndan qism tanlang.</p>
                    ) : (
                      <div className="space-y-2">
                        {highlights.map((h) => (
                          <div
                            key={h.id}
                            className="p-3 rounded-xl bg-white/5 border border-white/5 relative group/item"
                          >
                            <p className="text-xs text-zinc-200 line-clamp-3 leading-relaxed">
                              &quot;{h.text}&quot;
                            </p>
                            <button
                              onClick={() => deleteHighlight(h.id)}
                              className="absolute top-2 right-2 p-1 rounded-lg bg-rose-500/10 text-rose-400 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notes Section */}
                  <div className="max-h-[300px] overflow-y-auto pr-1">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                      Qaydlar ({notes.length})
                    </h4>
                    {notes.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic">Izoh qoldirish uchun belgilangan matnga qayd qo'shing.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {notes.map((n) => (
                          <div key={n.id} className="p-3 rounded-xl bg-white/5 border border-white/5 group/item relative">
                            <p className="text-[10px] text-zinc-500 italic mb-1 truncate">&quot;{n.highlightText}&quot;</p>
                            <p className="text-xs text-zinc-200 leading-relaxed font-sans">{n.text}</p>
                            <button
                              onClick={() => deleteNote(n.id)}
                              className="absolute top-2 right-2 p-1 rounded-lg bg-rose-500/10 text-rose-400 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 text-[10px] text-zinc-600 text-center">
                  Barcha qaydlar mahalliy xotirada saqlanadi.
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
