"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  role: "user" | "admin";
  joinedAt: string;
  bio?: string;
  preferences?: {
    fontSize: number;
    theme: "dark" | "light" | "sepia" | "glass";
    fontFamily: "sans" | "serif" | "mono";
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string) => Promise<boolean>;
  loginWithOAuth: (provider: "google" | "github") => Promise<boolean>;
  logout: () => void;
  updateUserPreferences: (prefs: Partial<NonNullable<User["preferences"]>>) => void;
  updateUserProfile: (username: string, bio: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: "bv-user-1",
  email: "reader@bookverse.com",
  username: "Aria Sterling",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  role: "user",
  joinedAt: "2026-01-15T08:00:00Z",
  bio: "Voracious reader, software designer, and tech enthusiast. Lover of science fiction and classical literature.",
  preferences: {
    fontSize: 18,
    theme: "dark",
    fontFamily: "sans"
  }
};

const ADMIN_USER: User = {
  id: "bv-admin-1",
  email: "admin@bookverse.com",
  username: "Victor Verse",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  role: "admin",
  joinedAt: "2025-10-01T09:30:00Z",
  bio: "Lead Editor and System Administrator at BookVerse.",
  preferences: {
    fontSize: 16,
    theme: "dark",
    fontFamily: "mono"
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user session on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("bv_current_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Pre-login the standard demo user so the platform is immediately active
        setUser(DEMO_USER);
        localStorage.setItem("bv_current_user", JSON.stringify(DEMO_USER));
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
      setUser(DEMO_USER);
      localStorage.setItem("bv_current_user", JSON.stringify(DEMO_USER));
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string): Promise<boolean> => {
    setLoading(true);
    // Standard delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    let matchedUser = DEMO_USER;
    if (email.toLowerCase().includes("admin")) {
      matchedUser = ADMIN_USER;
    } else {
      matchedUser = {
        ...DEMO_USER,
        email: email
      };
    }

    setUser(matchedUser);
    localStorage.setItem("bv_current_user", JSON.stringify(matchedUser));
    setLoading(false);
    return true;
  };

  const loginWithOAuth = async (provider: "google" | "github"): Promise<boolean> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const matchedUser: User = {
      ...DEMO_USER,
      username: provider === "google" ? "Aria Google" : "Aria GitHub",
      email: `aria.${provider}@example.com`
    };

    setUser(matchedUser);
    localStorage.setItem("bv_current_user", JSON.stringify(matchedUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bv_current_user");
  };

  const updateUserPreferences = (prefs: Partial<NonNullable<User["preferences"]>>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences || { fontSize: 18, theme: "dark" as const, fontFamily: "sans" as const },
        ...prefs
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem("bv_current_user", JSON.stringify(updatedUser));
  };

  const updateUserProfile = (username: string, bio: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      username,
      bio
    };
    
    setUser(updatedUser);
    localStorage.setItem("bv_current_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        loginWithOAuth,
        logout,
        updateUserPreferences,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
