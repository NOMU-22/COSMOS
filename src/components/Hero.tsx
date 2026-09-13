"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import { useData } from "@/context/DataContext";
import {
  Calendar,
  Gamepad2,
  Trophy,
  Sparkles,
  ChevronDown,
  Monitor,
  Flame,
} from "lucide-react";

export default function Hero() {
  const { settings } = useData();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const businessName = settings?.businessName || "COSMOS GAMING";
  const tagline = settings?.tagline || "Play • Compete • Win • Repeat";

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Parallax Background Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${scrollY * 0.25}px)`,
        }}
      >
        {/* Deep Dark Gaming Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0c1a]/80 via-[#07070b]/90 to-[#07070b]" />

        {/* Ambient Glow Orbs */}
        <div className="cosmos-glow-orb w-[650px] h-[650px] bg-purple-600/20 -top-32 left-1/2 -translate-x-1/2 animate-pulse-slow" />
        <div className="cosmos-glow-orb w-[450px] h-[450px] bg-sky-500/15 top-1/3 -left-32 animate-float" />
        <div className="cosmos-glow-orb w-[400px] h-[400px] bg-pink-500/15 bottom-10 -right-20 animate-float" />

        {/* Subtle Cyber Matrix Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Verified Location & Tagline Badge */}
        <div className="inline-flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Badge variant="purple" size="md" className="py-1 px-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 border-purple-500/40">
            <Flame className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
            <span>Bandra East, Mumbai • Official Gaming Lounge</span>
          </Badge>
        </div>

        {/* Hero Main Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-['Rajdhani',sans-serif]">
            <span className="block text-slate-100">{businessName}</span>
            <span className="block bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(139,92,246,0.4)]">
              {tagline}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Experience next-level gaming at Mumbai&apos;s premier gaming center in Bandra East.
            Equipped with 240Hz PC esports setups, PlayStation 5 stations, 360° VR Gun pods, and
            force-feedback racing rigs.
          </p>
        </div>

        {/* Primary Liquid Glass Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/book" className="w-full sm:w-auto">
            <LiquidGlassButton
              variant="primary"
              size="lg"
              fullWidth
              icon={<Calendar className="w-5 h-5 text-white" />}
            >
              BOOK YOUR SLOT
            </LiquidGlassButton>
          </Link>

          <Link href="/#zones" className="w-full sm:w-auto">
            <LiquidGlassButton
              variant="secondary"
              size="lg"
              fullWidth
              icon={<Gamepad2 className="w-5 h-5 text-purple-400" />}
            >
              EXPLORE GAMING ZONES
            </LiquidGlassButton>
          </Link>
        </div>

        {/* Live Features Bar */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="glass-card !p-4 flex items-center gap-3 border-white/5 bg-white/[0.02]">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">PlayStation 5</p>
              <p className="text-[11px] text-slate-400">4K HDR 120Hz Displays</p>
            </div>
          </div>

          <div className="glass-card !p-4 flex items-center gap-3 border-white/5 bg-white/[0.02]">
            <div className="w-10 h-10 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Monitor className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">PC Esports Rigs</p>
              <p className="text-[11px] text-slate-400">240Hz High FPS Gaming</p>
            </div>
          </div>

          <div className="glass-card !p-4 flex items-center gap-3 border-white/5 bg-white/[0.02]">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">VR Gun Setup</p>
              <p className="text-[11px] text-slate-400">360° Room Immersion</p>
            </div>
          </div>

          <div className="glass-card !p-4 flex items-center gap-3 border-white/5 bg-white/[0.02]">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Tournaments</p>
              <p className="text-[11px] text-slate-400">Cash & Scholarships</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="pt-8">
          <a
            href="#zones"
            className="inline-flex flex-col items-center text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>Scroll to explore</span>
            <ChevronDown className="w-4 h-4 text-purple-400 animate-bounce mt-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
