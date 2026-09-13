"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import { GlassCard } from "./ui/GlassCard";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import { Calendar, Cpu, Gamepad, Sparkles } from "lucide-react";

export default function GamingZones() {
  const { zones, isLoading } = useData();

  return (
    <section id="zones" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Ambient Glow */}
      <div className="cosmos-glow-orb w-96 h-96 bg-purple-600/10 top-1/2 left-0 -translate-y-1/2" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <Badge variant="purple" size="md">
          VERIFIED GAMING STATIONS
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-['Rajdhani',sans-serif]">
          High-Performance Gaming Zones
        </h2>
        <p className="text-sm text-slate-300">
          Tailored battle stations engineered for maximum competitive edge and immersive entertainment in Bandra East, Mumbai.
        </p>
      </div>

      {/* Zones Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-card h-80 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {zones.map((zone) => (
            <GlassCard
              key={zone.id}
              className="group !p-0 border-white/10 hover:border-purple-500/40 flex flex-col justify-between"
            >
              {/* Image & Price Overlay */}
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={zone.imageUrl}
                  alt={zone.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e18] via-[#0e0e18]/40 to-transparent" />

                {/* Hourly Rate Badge */}
                <div className="absolute top-4 right-4 bg-purple-950/80 backdrop-blur-md border border-purple-500/40 px-3.5 py-1.5 rounded-full shadow-lg">
                  <span className="text-xs text-slate-300">From </span>
                  <span className="text-base font-bold text-white font-['Rajdhani',sans-serif]">
                    ₹{zone.hourlyRate}
                  </span>
                  <span className="text-xs text-purple-300">/hr</span>
                </div>

                {/* Capacity */}
                <div className="absolute top-4 left-4">
                  <Badge variant="blue" size="sm">
                    {zone.totalStations} Stations Available
                  </Badge>
                </div>

                {/* Zone Title */}
                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="text-2xl font-black uppercase tracking-wide text-white font-['Rajdhani',sans-serif]">
                    {zone.name}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {zone.description}
                  </p>

                  {/* Specifications */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-purple-300 font-semibold text-[11px] uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      <span>Specifications:</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{zone.specs}</p>
                  </div>

                  {/* Popular Games */}
                  {zone.popularGames && (
                    <div className="flex items-start gap-2 text-xs">
                      <Gamepad className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span className="text-slate-400 text-[11px]">
                        <strong className="text-slate-200">Featured Games: </strong>
                        {zone.popularGames}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Action */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-Time Availability Backed</span>
                  </div>
                  <Link href={`/book?zone=${zone.id}`}>
                    <LiquidGlassButton
                      variant="primary"
                      size="sm"
                      icon={<Calendar className="w-3.5 h-3.5" />}
                    >
                      BOOK NOW
                    </LiquidGlassButton>
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  );
}
