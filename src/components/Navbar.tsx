"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import {
  Gamepad2,
  Menu,
  X,
  User as UserIcon,
  Shield,
  Calendar,
  LogOut,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { settings } = useData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Gaming Zones", href: "/#zones" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Offers", href: "/#offers" },
    { name: "Tournaments", href: "/#events" },
    { name: "Community", href: "/community" },
    { name: "Location", href: "/#location" },
  ];

  return (
    <>
      {/* Top Announcement Bar if active */}
      {settings?.announcementActive && settings?.announcementText && (
        <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 border-b border-purple-500/20 text-xs py-2 px-4 text-center font-medium text-purple-200 tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>{settings.announcementText}</span>
          <Link
            href="/#events"
            className="underline text-white font-semibold hover:text-purple-300 ml-1"
          >
            View Details &rarr;
          </Link>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0a0a14]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] py-3"
            : "bg-transparent backdrop-blur-sm border-b border-white/5 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] transition-all">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Rajdhani',sans-serif] text-xl sm:text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent group-hover:to-purple-200 transition-colors">
                Cosmos Gaming
              </span>
              <span className="text-[10px] tracking-widest text-purple-400 font-semibold uppercase -mt-1">
                Bandra East • Mumbai
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? "text-white bg-purple-600/30 border border-purple-500/40 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center gap-3">
            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 hover:border-purple-500/40 transition-all text-xs text-white"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[11px] font-bold text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                  {user.role === "ADMIN" && (
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/40 font-bold">
                      ADMIN
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl p-2 shadow-2xl border border-white/10 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {user.phone || user.email}
                      </p>
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>{user.cosmosXp || 0} Cosmos XP</span>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>My Bookings & Dashboard</span>
                    </Link>

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>Admin CMS Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-1 border-t border-white/5"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <LiquidGlassButton variant="secondary" size="sm" icon={<UserIcon className="w-3.5 h-3.5 text-purple-400" />}>
                  Login / Signup
                </LiquidGlassButton>
              </Link>
            )}

            {/* Main Primary CTA: BOOK YOUR SLOT */}
            <Link href="/book">
              <LiquidGlassButton variant="primary" size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>
                BOOK YOUR SLOT
              </LiquidGlassButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link href="/book">
              <LiquidGlassButton variant="primary" size="sm">
                Book
              </LiquidGlassButton>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-6 mt-3 space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-purple-300 bg-purple-950/40 border border-purple-500/30"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>My Bookings ({user.name})</span>
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-300 bg-amber-950/40 border border-amber-500/30"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin CMS Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950/30 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <LiquidGlassButton variant="secondary" fullWidth icon={<UserIcon className="w-4 h-4" />}>
                    Login / Signup
                  </LiquidGlassButton>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
