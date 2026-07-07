"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Search, User, LogOut, Menu, X, LayoutDashboard, Sliders, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const { user, logout, updateUserPreferences } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Monitor scroll depth
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Kashf etish", href: "/" },
    { name: "Mening kutubxonam", href: "/dashboard" },
    { name: "Boshqaruv paneli", href: "/dashboard" }
  ];

  const toggleTheme = () => {
    if (!user) return;
    const currentTheme = user.preferences?.theme || "light";
    const nextTheme = currentTheme === "light" ? "dark" : currentTheme === "dark" ? "sepia" : "light";
    updateUserPreferences({ theme: nextTheme });
    
    // Apply class to body for reader styling
    const body = document.body;
    body.classList.remove("light-theme", "sepia-theme", "dark-theme");
    if (nextTheme === "light") body.classList.add("light-theme");
    if (nextTheme === "sepia") body.classList.add("sepia-theme");
    if (nextTheme === "dark") body.classList.add("dark-theme");
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "py-3 bg-white/45 backdrop-blur-xl border-b border-black/5" 
          : "py-5 bg-transparent border-b border-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/10 group-hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-800">
            Book<span className="text-violet-600">Verse</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isActive ? "text-zinc-900 font-semibold" : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-violet-500 rounded-full"
                    layoutId="activeNavLink"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

        </nav>

        {/* Right side items */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search Trigger */}
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="p-2.5 rounded-xl bg-black/5 border border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-black/8 transition-all duration-300 cursor-pointer"
              title="Kitoblarni qidirish"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Quick theme trigger */}
          {user && (
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-black/5 border border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-black/8 transition-all duration-300 cursor-pointer text-xs font-semibold"
              title="Mutolaa sozlamalari"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}

          {/* Admin Portal Button */}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="px-4.5 py-2.5 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-700 hover:bg-violet-600/20 hover:text-violet-800 text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin paneli
            </Link>
          )}

          {/* Auth Controls */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-black/5 border border-transparent hover:bg-black/8 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-black/10"
                />
                <span className="text-sm font-medium text-zinc-800">{user.username.split(" ")[0]}</span>
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <>
                    {/* Click Out Close */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    
                    <motion.div
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 z-50"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-3 py-2.5 border-b border-black/5 mb-1">
                        <p className="text-xs text-zinc-500 font-medium">Tizimga kirilgan</p>
                        <p className="text-sm font-semibold text-zinc-800 truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-600 hover:text-zinc-950 hover:bg-black/5 transition-colors duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 text-zinc-500" />
                        Mening kutubxonam
                      </Link>

                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-600 hover:text-zinc-950 hover:bg-black/5 transition-colors duration-200"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                          Admin boshqaruvi
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors duration-200 text-left mt-1 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Chiqish
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white hover:shadow-lg hover:shadow-violet-600/10 active:scale-98 transition-all duration-300"
            >
              Kirish
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="p-2 rounded-xl bg-black/5 text-zinc-500"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl bg-black/5 text-zinc-650 hover:text-zinc-950"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-x-0 top-[70px] bottom-0 bg-white/95 backdrop-blur-2xl z-40 px-6 py-8 flex flex-col gap-6 md:hidden border-t border-black/5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-zinc-600 hover:text-zinc-950 transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-lg font-medium text-violet-700 hover:text-violet-800 transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin paneli
                </Link>
              )}
            </div>

            <div className="h-px bg-black/5 my-2" />

            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/10"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-800">{user.username}</h4>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center font-medium text-rose-600 hover:bg-rose-500/20 transition-all duration-200"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-center font-semibold text-white shadow-lg shadow-violet-500/10"
                onClick={() => setMenuOpen(false)}
              >
                Kirish
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
