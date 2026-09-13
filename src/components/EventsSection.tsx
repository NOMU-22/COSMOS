"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import { GlassCard } from "./ui/GlassCard";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Award,
  CheckCircle,
  X,
  Sparkles,
} from "lucide-react";
import { EventTournament } from "@/types";

export default function EventsSection() {
  const { events, isLoading, refreshData } = useData();
  const [selectedEvent, setSelectedEvent] = useState<EventTournament | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    playerName: "",
    playerPhone: "",
    playerEmail: "",
    gamerTag: "",
  });
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsRegistering(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ type: "error", text: data.error || "Registration failed" });
      } else {
        setStatusMessage({ type: "success", text: data.message });
        setFormData({ playerName: "", playerPhone: "", playerEmail: "", gamerTag: "" });
        refreshData();
      }
    } catch (error) {
      setStatusMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isLoading && events.length === 0) {
    return null;
  }

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Ambient Glow */}
      <div className="cosmos-glow-orb w-96 h-96 bg-purple-600/10 top-0 right-1/3" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <Badge variant="purple" size="md">
          <Trophy className="w-3.5 h-3.5 mr-1 text-purple-400" />
          VERIFIED ESPORTS TOURNAMENTS
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-['Rajdhani',sans-serif]">
          Cosmos Gaming Championships
        </h2>
        <p className="text-sm text-slate-300">
          Compete on official tournament PS5 and PC setups. Win verified cash scholarships, memberships, and cafe glory.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((n) => (
            <div key={n} className="glass-card h-96 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <GlassCard
              key={event.id}
              className="group !p-0 border-white/10 hover:border-purple-500/40 flex flex-col justify-between"
            >
              {/* Event Banner */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={event.bannerUrl || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e18] via-[#0e0e18]/50 to-transparent" />

                {/* Entry Fee Badge */}
                <div className="absolute top-4 right-4 bg-purple-950/80 backdrop-blur-md border border-purple-500/40 px-3.5 py-1.5 rounded-full shadow-lg">
                  <span className="text-xs text-slate-300">Entry: </span>
                  <span className="text-base font-bold text-white font-['Rajdhani',sans-serif]">
                    {event.entryFee > 0 ? `₹${event.entryFee}` : "FREE"}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="purple" size="sm">
                    {event.category.replace("_", " ")}
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="text-2xl font-black uppercase tracking-wide text-white font-['Rajdhani',sans-serif]">
                    {event.title}
                  </h3>
                  <p className="text-xs text-purple-300 font-semibold mt-0.5">{event.game}</p>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Prize Pool Highlight */}
                  {event.prizePool && (
                    <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3 text-xs">
                      <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                          Prize Pool & Rewards
                        </p>
                        <p className="text-white font-medium mt-0.5">{event.prizePool}</p>
                      </div>
                    </div>
                  )}

                  {/* Metadata info */}
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{event.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{event.startTime} Onwards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>
                        {event.currentParticipants} / {event.maxParticipants} Registered
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                      <span>{event.format}</span>
                    </div>
                  </div>

                  {event.rules && (
                    <p className="text-[11px] text-slate-400 italic bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      *Rules: {event.rules}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-medium">
                    📍 Cosmos Centre, Bandra East
                  </span>
                  <LiquidGlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedEvent(event);
                      setStatusMessage(null);
                    }}
                    icon={<Trophy className="w-3.5 h-3.5" />}
                  >
                    REGISTER NOW
                  </LiquidGlassButton>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Tournament Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 sm:p-8 space-y-6 relative border border-white/15">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <Badge variant="purple" size="sm">
                TOURNAMENT REGISTRATION
              </Badge>
              <h3 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                {selectedEvent.title}
              </h3>
              <p className="text-xs text-purple-300 font-medium">{selectedEvent.game} • {selectedEvent.format}</p>
            </div>

            {statusMessage ? (
              <div
                className={`p-4 rounded-xl border text-sm space-y-3 ${
                  statusMessage.type === "success"
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                    : "bg-red-950/40 border-red-500/40 text-red-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {statusMessage.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
                {statusMessage.type === "success" && (
                  <LiquidGlassButton
                    variant="secondary"
                    fullWidth
                    size="sm"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Close Window
                  </LiquidGlassButton>
                )}
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Player Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.playerName}
                    onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                    placeholder="e.g. Rahul Verma"
                    className="glass-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.playerPhone}
                      onChange={(e) => setFormData({ ...formData, playerPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      In-Game Tag / PSN ID
                    </label>
                    <input
                      type="text"
                      value={formData.gamerTag}
                      onChange={(e) => setFormData({ ...formData, gamerTag: e.target.value })}
                      placeholder="e.g. COSMOS_STRIKER"
                      className="glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.playerEmail}
                    onChange={(e) => setFormData({ ...formData, playerEmail: e.target.value })}
                    placeholder="name@gmail.com"
                    className="glass-input"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                  <span>Entry Fee Due:</span>
                  <span className="font-bold text-base text-white font-['Rajdhani',sans-serif]">
                    {selectedEvent.entryFee > 0 ? `₹${selectedEvent.entryFee}` : "FREE ENTRY"}
                  </span>
                </div>

                <LiquidGlassButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isRegistering}
                  icon={<Trophy className="w-4 h-4" />}
                >
                  {isRegistering ? "Confirming Registration..." : "CONFIRM REGISTRATION"}
                </LiquidGlassButton>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
