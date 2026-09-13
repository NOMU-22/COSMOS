"use client";

import React from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { GlassCard } from "./ui/GlassCard";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import { Check, Sparkles, Calendar, Zap } from "lucide-react";

export default function PricingSection() {
  const { pricing, isLoading } = useData();

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Ambient Glow */}
      <div className="cosmos-glow-orb w-96 h-96 bg-sky-600/10 top-1/3 right-0 -translate-y-1/2" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <Badge variant="blue" size="md">
          DYNAMIC CMS PRICING
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-['Rajdhani',sans-serif]">
          Session Rates & Gaming Passes
        </h2>
        <p className="text-sm text-slate-300">
          Transparent, competitive rates with no hidden fees. Flexible single-hour slots or discounted marathon passes.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card h-96 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : pricing.length === 0 ? (
        <div className="glass-card text-center p-12 max-w-md mx-auto space-y-4">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
          <p className="text-sm text-slate-300">
            Contact Cosmos Gaming for current pricing and customized group packages.
          </p>
          <a
            href="https://wa.me/919820012345?text=Hi%20Cosmos%20Gaming%2C%20what%20are%20your%20current%20rates%3F"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LiquidGlassButton variant="secondary" size="sm">
              Enquire on WhatsApp
            </LiquidGlassButton>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricing.map((tier) => {
            let features: string[] = [];
            try {
              features = typeof tier.features === "string" ? JSON.parse(tier.features) : tier.features;
            } catch {
              features = ["High-Speed LAN", "Zero Input Lag", "Staff Assistance"];
            }

            return (
              <GlassCard
                key={tier.id}
                glow={tier.isFeatured ? "purple" : "none"}
                className={`flex flex-col justify-between relative ${
                  tier.isFeatured
                    ? "border-purple-500/50 bg-purple-950/20 shadow-[0_0_35px_rgba(139,92,246,0.25)]"
                    : "border-white/10"
                }`}
              >
                {/* Popular Tag */}
                {tier.tag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant={tier.isFeatured ? "purple" : "blue"} size="sm">
                      <Zap className="w-3 h-3 mr-1 fill-current" />
                      {tier.tag}
                    </Badge>
                  </div>
                )}

                <div className="space-y-6 pt-2">
                  <div>
                    <h3 className="text-xl font-bold text-white font-['Rajdhani',sans-serif]">
                      {tier.title}
                    </h3>
                    <p className="text-xs text-purple-300 font-medium mt-0.5">
                      {tier.zoneType}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white font-['Rajdhani',sans-serif]">
                      ₹{tier.price}
                    </span>
                    {tier.originalPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        ₹{tier.originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      / {tier.durationHours} {tier.durationHours === 1 ? "Hour" : "Hours"}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 text-xs text-slate-300 border-t border-white/5 pt-6">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-6 border-t border-white/5">
                  <Link href="/book">
                    <LiquidGlassButton
                      variant={tier.isFeatured ? "primary" : "secondary"}
                      fullWidth
                      icon={<Calendar className="w-4 h-4" />}
                    >
                      Book Session
                    </LiquidGlassButton>
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </section>
  );
}
