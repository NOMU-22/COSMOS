"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { GlassCard } from "./ui/GlassCard";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import { Tag, Copy, Check, Sparkles, Flame, Clock } from "lucide-react";

export default function OffersSection() {
  const { offers, isLoading } = useData();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (!isLoading && offers.length === 0) {
    return null; // Hide if no active published offers
  }

  return (
    <section id="offers" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Ambient Glow */}
      <div className="cosmos-glow-orb w-96 h-96 bg-pink-600/10 bottom-0 left-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <Badge variant="pink" size="md">
          <Flame className="w-3.5 h-3.5 mr-1 text-pink-400 fill-pink-400" />
          ACTIVE PROMOTIONS & CHALLENGES
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-['Rajdhani',sans-serif]">
          Featured Offers & Beat-The-Pro Challenges
        </h2>
        <p className="text-sm text-slate-300">
          Exclusive discounts, squad passes, and skill-based reward challenges at Cosmos Gaming Mumbai.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card h-72 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <GlassCard
              key={offer.id}
              className="border-white/10 hover:border-pink-500/40 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="pink" size="sm">
                    {offer.discountType === "PERCENTAGE"
                      ? `${offer.discountValue}% DISCOUNT`
                      : `FLAT ₹${offer.discountValue} OFF`}
                  </Badge>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-pink-400" />
                    <span>Valid till {offer.endDate}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white font-['Rajdhani',sans-serif]">
                  {offer.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {offer.description}
                </p>

                {offer.terms && (
                  <p className="text-[11px] text-slate-400 italic bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                    *Terms: {offer.terms}
                  </p>
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-white/5 space-y-3">
                {/* Promo Code Copy Bar */}
                <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-pink-400" />
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      {offer.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(offer.code)}
                    className="text-xs text-pink-300 hover:text-pink-200 flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <Link href={`/book?offer=${offer.code}`}>
                  <LiquidGlassButton variant="secondary" fullWidth size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                    Apply in Booking
                  </LiquidGlassButton>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  );
}
