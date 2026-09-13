"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import { GlassCard } from "./ui/GlassCard";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import { MapPin, Phone, Clock, Navigation, Link as InstagramIcon, Mail } from "lucide-react";

export default function LocationSection() {
  const { settings } = useData();

  const businessName = settings?.businessName || "Cosmos Gaming Mumbai";
  const address = settings?.address || "Cosmos Gaming Centre, Bandra East, Mumbai, Maharashtra 400051";
  const phone = settings?.phone || "+91 98200 12345";
  const whatsapp = settings?.whatsapp || "+91 98200 12345";
  const openingHours = `${settings?.openingTime || "11:00 AM"} – ${settings?.closingTime || "11:00 PM"}`;
  const days = settings?.operatingDays || "Monday – Sunday (All 7 Days)";
  const mapsUrl = settings?.googleMapsUrl || "https://maps.google.com/?q=Bandra+East+Mumbai";
  const instagramUrl = settings?.instagram || "https://www.instagram.com/cosmosgamingmumbai/";

  return (
    <section id="location" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Ambient Glow */}
      <div className="cosmos-glow-orb w-96 h-96 bg-purple-600/10 bottom-0 right-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <Badge variant="purple" size="md">
          <MapPin className="w-3.5 h-3.5 mr-1 text-purple-400" />
          VISIT THE ARENA
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-['Rajdhani',sans-serif]">
          Location & Contact
        </h2>
        <p className="text-sm text-slate-300">
          Conveniently located in Bandra East, Mumbai. Easy access, comfortable air-conditioned gaming environment, and high-speed LAN.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Card: Verified Contact & Schedule */}
        <GlassCard className="space-y-6 flex flex-col justify-between border-white/10">
          <div className="space-y-6">
            <div>
              <span className="text-xs text-purple-400 font-bold tracking-widest uppercase">
                Cosmos Gaming Centre
              </span>
              <h3 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-0.5">
                {businessName}
              </h3>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Arena Address:
                </p>
                <p className="text-slate-300 leading-relaxed">{address}</p>
                <p className="text-[11px] text-purple-400 font-semibold">Bandra East, Mumbai, Maharashtra</p>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Operating Schedule:
                </p>
                <p className="text-slate-300">{openingHours}</p>
                <p className="text-[11px] text-slate-400">{days}</p>
              </div>
            </div>

            {/* Direct Lines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`tel:${phone}`}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 flex items-center gap-3 transition-colors text-xs text-slate-300"
              >
                <Phone className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Call Front Desk</p>
                  <p className="font-semibold text-white">{phone}</p>
                </div>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-pink-500/30 flex items-center gap-3 transition-colors text-xs text-slate-300"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Instagram</p>
                  <p className="font-semibold text-white">@cosmosgamingmumbai</p>
                </div>
              </a>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Cosmos%20Gaming%2C%20I%20want%20to%20enquire%20about%20booking%20a%20slot`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <LiquidGlassButton
                variant="primary"
                fullWidth
                size="sm"
                icon={<Phone className="w-4 h-4" />}
              >
                WhatsApp Booking
              </LiquidGlassButton>
            </a>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <LiquidGlassButton
                variant="secondary"
                fullWidth
                size="sm"
                icon={<Navigation className="w-4 h-4 text-sky-400" />}
              >
                Get Directions
              </LiquidGlassButton>
            </a>
          </div>
        </GlassCard>

        {/* Right Card: Interactive Map Display */}
        <GlassCard className="!p-0 overflow-hidden border-white/10 relative min-h-[380px] flex flex-col justify-end">
          <div className="absolute inset-0 bg-[#0e0e18]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.835497426861!2d72.8465!3d19.0596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e123456789%3A0x123456789abcdef!2sBandra%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Cosmos Gaming Bandra East Mumbai Map"
            />
          </div>

          <div className="relative z-10 p-6 bg-gradient-to-t from-[#07070b] via-[#07070b]/90 to-transparent">
            <div className="p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white font-['Rajdhani',sans-serif]">
                  COSMOS GAMING CENTRE
                </p>
                <p className="text-[11px] text-slate-400">Bandra East, Mumbai • Landmark Area</p>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <LiquidGlassButton variant="primary" size="sm">
                  Open Maps
                </LiquidGlassButton>
              </a>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
