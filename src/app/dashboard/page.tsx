"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar,
  Clock,
  Gamepad2,
  Sparkles,
  Phone,
  Mail,
  User,
  LogOut,
  Navigation,
  Download,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Booking } from "@/types";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [past, setPast] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "PAST" | "XP" | "PROFILE">("UPCOMING");
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch("/api/bookings/my");
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        setUpcoming(data.upcoming || []);
        setPast(data.past || []);
      }
    } catch (error) {
      console.error("Failed to load user bookings:", error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage("Booking cancelled successfully.");
        fetchBookings();
      } else {
        alert(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-xs text-slate-400">
        Loading Gamer Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 relative">
      {/* Ambient Glows */}
      <div className="cosmos-glow-orb w-[600px] h-[600px] bg-purple-600/15 top-0 right-1/4" />

      {/* Profile Header Banner */}
      <GlassCard glow="purple" className="border-purple-500/30 bg-purple-950/20 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-2xl font-black text-white shadow-[0_0_20px_rgba(139,92,246,0.6)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-['Rajdhani',sans-serif]">
                  Welcome, {user.name}
                </h1>
                <Badge variant="purple" size="sm">MY COSMOS</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                    <span>{user.phone}</span>
                    <Badge variant="green" size="sm" className="!text-[10px] !py-0 !px-1.5">Verified</Badge>
                  </span>
                )}
                {user.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span>{user.email}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Cosmos XP Balance */}
            <div className="px-4 py-2.5 rounded-xl bg-black/50 border border-purple-500/40 text-center">
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                Cosmos XP
              </p>
              <p className="text-xl font-black text-white font-['Rajdhani',sans-serif]">
                {user.cosmosXp || 0} XP
              </p>
            </div>

            <Link href="/book">
              <LiquidGlassButton variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
                Book New Slot
              </LiquidGlassButton>
            </Link>

            <button
              onClick={logout}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-red-950/30 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-400 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("UPCOMING")}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === "UPCOMING"
              ? "bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Upcoming Bookings ({upcoming.length})
        </button>

        <button
          onClick={() => setActiveTab("PAST")}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === "PAST"
              ? "bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Booking History ({past.length})
        </button>

        <button
          onClick={() => setActiveTab("XP")}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === "XP"
              ? "bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Rewards & XP
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* TAB 1: UPCOMING BOOKINGS */}
      {activeTab === "UPCOMING" && (
        <div className="space-y-6">
          {isLoadingBookings ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="glass-card h-40 animate-pulse bg-white/5" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <GlassCard className="text-center py-16 space-y-4 border-white/10">
              <Gamepad2 className="w-12 h-12 text-purple-400 mx-auto opacity-50" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Upcoming Gaming Sessions</h3>
                <p className="text-xs text-slate-400">
                  Ready to drop into the arena? Reserve your PS5, PC, VR or Simulator slot now.
                </p>
              </div>
              <Link href="/book">
                <LiquidGlassButton variant="primary" size="md">
                  Book Your Slot Now
                </LiquidGlassButton>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((b) => (
                <GlassCard
                  key={b.id}
                  className="space-y-4 border-purple-500/30 bg-purple-950/20 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="purple" size="sm">
                        {b.zoneName}
                      </Badge>
                      <span className="font-mono text-xs text-purple-300 font-bold">
                        {b.bookingRef}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold text-white">{b.bookingDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>
                          {b.startTime} – {b.endTime} ({b.durationHours} hrs)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-sky-400" />
                        <span>
                          Station #{b.stationNumber} • {b.playersCount} Gamer(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm font-bold text-white font-['Rajdhani',sans-serif]">
                      ₹{b.totalAmount} ({b.paymentStatus})
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://maps.google.com/?q=Bandra+East+Mumbai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                        title="Get Directions to Cosmos"
                      >
                        <Navigation className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                      >
                        Cancel Slot
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAST BOOKINGS */}
      {activeTab === "PAST" && (
        <div className="space-y-6">
          {past.length === 0 ? (
            <GlassCard className="text-center py-12 border-white/10">
              <p className="text-xs text-slate-400">No past sessions recorded yet.</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {past.map((b) => (
                <GlassCard
                  key={b.id}
                  className="!p-4 border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{b.zoneName}</span>
                      <Badge variant={b.bookingStatus === "CANCELLED" ? "neutral" : "green"} size="sm">
                        {b.bookingStatus}
                      </Badge>
                    </div>
                    <p className="text-slate-400">
                      {b.bookingDate} • {b.startTime} – {b.endTime} • Ref: {b.bookingRef}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-white font-['Rajdhani',sans-serif]">
                      ₹{b.totalAmount}
                    </span>
                    <Link href={`/book?zone=${b.zoneId}`}>
                      <LiquidGlassButton variant="secondary" size="sm">
                        Book Again
                      </LiquidGlassButton>
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REWARDS & XP */}
      {activeTab === "XP" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="space-y-4 border-purple-500/30 bg-purple-950/20">
            <h3 className="text-xl font-bold uppercase text-white font-['Rajdhani',sans-serif]">
              Cosmos XP Status
            </h3>
            <div className="p-6 rounded-2xl bg-black/50 border border-white/10 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
              <p className="text-3xl font-black text-white font-['Rajdhani',sans-serif]">
                {user.cosmosXp || 0} XP
              </p>
              <p className="text-xs text-slate-400">Tier: Bronze Gamer</p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Earn 50 XP per standard gaming hour and 250 XP for every tournament you enter.
            </p>
          </GlassCard>

          <GlassCard className="space-y-4 border-white/10">
            <h3 className="text-xl font-bold uppercase text-white font-['Rajdhani',sans-serif]">
              Available Rewards
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">1 Hour Free Gameplay</p>
                  <p className="text-slate-400">Requires 1000 Cosmos XP</p>
                </div>
                <Badge variant={user.cosmosXp >= 1000 ? "green" : "neutral"} size="sm">
                  {user.cosmosXp >= 1000 ? "Unlocked" : "Locked"}
                </Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">50% Off Tournament Entry</p>
                  <p className="text-slate-400">Requires 500 Cosmos XP</p>
                </div>
                <Badge variant={user.cosmosXp >= 500 ? "green" : "neutral"} size="sm">
                  {user.cosmosXp >= 500 ? "Unlocked" : "Locked"}
                </Badge>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
