"use client";

import React from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import EventsSection from "@/components/EventsSection";
import OffersSection from "@/components/OffersSection";
import {
  Trophy,
  Sparkles,
  Shield,
  Zap,
  Gift,
  Award,
  Calendar,
  Gamepad2,
} from "lucide-react";

export default function CommunityPage() {
  const { settings } = useData();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 relative">
      {/* Background Ambient Glows */}
      <div className="cosmos-glow-orb w-[600px] h-[600px] bg-purple-600/15 top-0 left-1/2 -translate-x-1/2" />

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="purple" size="md">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          COSMOS ESPORTS COMMUNITY
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Rajdhani',sans-serif]">
          Tournaments, Rewards & Community
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Welcome to Mumbai&apos;s most competitive and welcoming gaming hub. Play everyday matches,
          climb the leaderboards, earn Cosmos XP, and compete in monthly cash cup tournaments.
        </p>
      </div>

      {/* Cosmos XP Loyalty Program Feature */}
      <GlassCard glow="purple" className="border-purple-500/40 bg-purple-950/20 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <Badge variant="purple" size="sm">
              LOYALTY REWARDS
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-['Rajdhani',sans-serif]">
              Earn Cosmos XP with Every Session
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every hour you play at Cosmos Gaming Mumbai automatically earns you Cosmos XP points.
              Redeem your accumulated XP for free gaming hours, tournament entry fee discounts, and
              exclusive Cosmos merchandise.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <p className="text-base font-bold text-purple-300 font-['Rajdhani',sans-serif]">
                  +50 XP / Hour
                </p>
                <p className="text-[11px] text-slate-400">Regular PC & PS5 Play</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <p className="text-base font-bold text-sky-300 font-['Rajdhani',sans-serif]">
                  +100 XP / Hour
                </p>
                <p className="text-[11px] text-slate-400">VR & Simulator Cockpit</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <p className="text-base font-bold text-amber-300 font-['Rajdhani',sans-serif]">
                  +250 XP
                </p>
                <p className="text-[11px] text-slate-400">Tournament Participation</p>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-right space-y-3">
            <div className="p-6 rounded-2xl bg-black/60 border border-purple-500/30 inline-block text-center space-y-2">
              <Gift className="w-10 h-10 text-purple-400 mx-auto" />
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                1000 XP = 1 Hour Free
              </p>
              <p className="text-[11px] text-slate-400">Applicable on any gaming zone</p>
            </div>
            <div>
              <Link href="/book">
                <LiquidGlassButton variant="primary" size="md">
                  Book to Earn XP
                </LiquidGlassButton>
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Active Tournaments Section */}
      <EventsSection />

      {/* Offers & Challenges Section */}
      <OffersSection />

      {/* Fair Play & Community Guidelines */}
      <GlassCard className="border-white/10 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Shield className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-xl font-bold uppercase text-white font-['Rajdhani',sans-serif]">
              Cosmos Arena Rules & Fair Play
            </h3>
            <p className="text-xs text-slate-400">Standard esports guidelines for all visitors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-purple-300">
              1. Respect & Sportsmanship
            </h4>
            <p className="leading-relaxed text-slate-400">
              Zero tolerance for toxic behavior, verbal abuse, or harassment. Play hard, compete fiercely, but treat fellow gamers with respect.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-sky-300">
              2. Peripherals Care
            </h4>
            <p className="leading-relaxed text-slate-400">
              Our 240Hz monitors, mechanical keyboards, DualSense controllers, and VR setups are calibrated for peak precision. Please handle hardware with care.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-300">
              3. Anti-Cheat & Fair Gaming
            </h4>
            <p className="leading-relaxed text-slate-400">
              Use of unauthorized 3rd party software, scripts, or cheats in competitive matches results in immediate lifetime ban from all Cosmos events.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
