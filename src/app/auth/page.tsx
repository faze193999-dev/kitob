"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithOAuth, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isSignUp && !username)) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const success = await loginWithEmail(email);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Email yoki parol noto'g'ri. reader@bookverse.com hisobini sinab ko'ring.");
      }
    } catch {
      setError("Avtorizatsiya jarayonida xatolik yuz berdi.");
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError("");
    try {
      const success = await loginWithOAuth(provider);
      if (success) {
        router.push("/dashboard");
      }
    } catch {
      setError("OAuth orqali kirish amalga oshmadi.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-orange-200/15 blur-[130px]" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-violet-200/10 blur-[130px]" />

      {/* Floating cards backdrop */}
      <motion.div
        className="w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 border border-black/5 relative z-10 shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
      >
        {/* Brand Link */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-zinc-800">
            Book<span className="text-violet-600">Verse</span>
          </Link>
          <p className="text-zinc-500 text-sm mt-2">
            {isSignUp ? "Shaxsiy mutolaa hisobingizni yarating" : "Shaxsiy kutubxonangizga kiring"}
          </p>
        </div>

        {error && (
          <motion.div
            className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <User className="absolute left-4 top-4 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Foydalanuvchi nomi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/5 border border-black/5 text-zinc-800 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:bg-white/80 transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-4 w-4 h-4 text-zinc-500" />
            <input
              type="email"
              placeholder="Email manzili"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/5 border border-black/5 text-zinc-800 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:bg-white/80 transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 w-4 h-4 text-zinc-500" />
            <input
              type="password"
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/5 border border-black/5 text-zinc-800 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:bg-white/80 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-violet-600/5 hover:shadow-violet-600/10 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                {isSignUp ? "Hisob yaratish" : "Kutubxonaga kirish"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-black/5" />
          <span className="relative z-10 px-3 py-1 rounded-full border border-black/5 bg-white text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            yoki quyidagilar bilan
          </span>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleOAuth("google")}
            disabled={loading}
            className="py-3 rounded-xl bg-black/5 border border-black/5 hover:bg-black/8 hover:border-black/10 text-zinc-600 hover:text-zinc-950 transition-all text-xs font-semibold flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.92 1 12s4.92 11 11.24 11c6.6 0 11-4.636 11-11.202 0-.756-.08-1.332-.18-1.813H12.24z" />
            </svg>
            Google
          </button>
          <button
            onClick={() => handleOAuth("github")}
            disabled={loading}
            className="py-3 rounded-xl bg-black/5 border border-black/5 hover:bg-black/8 hover:border-black/10 text-zinc-600 hover:text-zinc-950 transition-all text-xs font-semibold flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Github className="w-4 h-4" />
            GitHub
          </button>
        </div>

        {/* Toggle Sign Up / Sign In */}
        <div className="text-center mt-8 text-xs font-medium text-zinc-500">
          {isSignUp ? (
            <p>
              Hisobingiz bormi?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-violet-600 hover:text-violet-800 font-bold ml-1 cursor-pointer"
              >
                Kirish
              </button>
            </p>
          ) : (
            <p>
              Hisobingiz yo'qmi?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-violet-600 hover:text-violet-800 font-bold ml-1 cursor-pointer"
              >
                Ro'yxatdan o'tish
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
