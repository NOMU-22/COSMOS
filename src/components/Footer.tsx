"use client";

import React from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import {
  Gamepad2,
  Link as InstagramIcon,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const { settings } = useData();

  const businessName = settings?.businessName || "Cosmos Gaming Mumbai";
  const address = settings?.address || "Cosmos Gaming Centre, Bandra East, Mumbai, Maharashtra 400051";
  const phone = settings?.phone || "+91 98200 12345";
  const whatsapp = settings?.whatsapp || "+91 98200 12345";
  const email = settings?.email || "contact@cosmosgamingmumbai.com";
  const hours = `${settings?.openingTime || "11:00 AM"} – ${settings?.closingTime || "11:00 PM"}`;
  const days = settings?.operatingDays || "Monday – Sunday (All 7 Days)";
  const instagramUrl = settings?.instagram || "https://www.instagram.com/cosmosgamingmumbai/";

  return (
    <footer className="bg-[#050508] border-t border-white/10 relative overflow-hidden pt-16 pb-12 mt-20">
      {/* Subtle Ambient Lighting */}
      <div className="cosmos-glow-orb w-96 h-96 bg-purple-900/10 top-0 left-1/4" />
      <div className="cosmos-glow-orb w-96 h-96 bg-sky-900/10 bottom-0 right-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                <Gamepad2 className="w-6 h-6 text-purple-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Rajdhani',sans-serif] text-xl font-black tracking-wider uppercase text-white">
                  {businessName}
                </span>
                <span className="text-[10px] tracking-widest text-purple-400 font-semibold uppercase">
                  Bandra East • Mumbai
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mumbai&apos;s ultimate gaming destination in Bandra East. Next-gen PlayStation 5 console
              stations, 240Hz competitive PC esports rigs, immersive VR Gun Pods, and force-feedback
              racing simulators.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                aria-label="Official Instagram @cosmosgamingmumbai"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Cosmos%20Gaming%2C%20I%20want%20to%20enquire%20about%20booking`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                aria-label="WhatsApp Us"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/book" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Online Slot Booking</span>
                </Link>
              </li>
              <li>
                <Link href="/#zones" className="hover:text-white transition-colors">
                  Gaming Zones & Setups
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Session Rates & Packages
                </Link>
              </li>
              <li>
                <Link href="/#offers" className="hover:text-white transition-colors">
                  Active Offers & Challenges
                </Link>
              </li>
              <li>
                <Link href="/#events" className="hover:text-white transition-colors">
                  Esports Tournaments
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  Cosmos XP Rewards & Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Hours & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Operating Hours
            </h4>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{hours}</p>
                  <p className="text-[11px] text-slate-400">{days}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Walk-Ins & Online Bookings Active</span>
              </div>
            </div>
          </div>

          {/* Col 4: Verified Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Verified Location
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-purple-300">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-purple-300">
                  {email}
                </a>
              </div>
              <a
                href={settings?.googleMapsUrl || "https://maps.google.com/?q=Bandra+East+Mumbai"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 pt-1 font-medium underline"
              >
                <span>Open in Google Maps &rarr;</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Cosmos Gaming Mumbai. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Verified Bandra East Gaming Centre
            </span>
            <Link href="/admin" className="text-slate-500 hover:text-purple-400 transition-colors">
              Admin CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
