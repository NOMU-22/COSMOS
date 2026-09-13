"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar,
  DollarSign,
  Users,
  Tag,
  Trophy,
  ArrowUpRight,
  Clock,
  Plus,
  Gamepad2,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to load admin metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (isLoading) {
    return <div className="py-24 text-center text-xs text-slate-400">Loading Admin Metrics...</div>;
  }

  const metrics = data?.metrics || {};
  const recentBookings = data?.recentBookings || [];
  const upcomingEvents = data?.upcomingEvents || [];
  const activeOffers = data?.activeOffers || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="sm">
            MANAGEMENT DASHBOARD
          </Badge>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-['Rajdhani',sans-serif] mt-1">
            Cosmos Gaming Centre Control Hub
          </h1>
          <p className="text-xs text-slate-400">
            Real-time business performance, slot occupancy, and CMS content status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/bookings">
            <LiquidGlassButton variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Add Manual Booking
            </LiquidGlassButton>
          </Link>
          <Link href="/admin/offers">
            <LiquidGlassButton variant="secondary" size="sm" icon={<Tag className="w-3.5 h-3.5" />}>
              Create Offer
            </LiquidGlassButton>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <GlassCard className="!p-5 border-white/10 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white font-['Rajdhani',sans-serif]">
              ₹{metrics.totalRevenue || 0}
            </p>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">
              ₹{metrics.todayRevenue || 0} earned today
            </p>
          </div>
        </GlassCard>

        {/* Metric 2: Today's Bookings */}
        <GlassCard className="!p-5 border-white/10 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white font-['Rajdhani',sans-serif]">
              {metrics.todayBookingsCount || 0}
            </p>
            <p className="text-[11px] text-purple-300 font-medium mt-1">
              {metrics.upcomingBookingsCount || 0} upcoming sessions
            </p>
          </div>
        </GlassCard>

        {/* Metric 3: Total Customers */}
        <GlassCard className="!p-5 border-white/10 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Gamers</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white font-['Rajdhani',sans-serif]">
              {metrics.totalCustomers || 0}
            </p>
            <Link href="/admin/customers" className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 mt-1">
              <span>View Gamer Directory</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </GlassCard>

        {/* Metric 4: Active Promos & Events */}
        <GlassCard className="!p-5 border-white/10 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Promos & Events</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white font-['Rajdhani',sans-serif]">
              {metrics.activeOffersCount + metrics.upcomingEventsCount}
            </p>
            <p className="text-[11px] text-amber-300 font-medium mt-1">
              {metrics.upcomingEventsCount} tournaments live
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Two Column Layout: Recent Bookings & Quick CMS Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Bookings Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white uppercase font-['Rajdhani',sans-serif]">
              Recent Booking Stream
            </h3>
            <Link href="/admin/bookings" className="text-xs text-purple-400 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <GlassCard className="!p-0 border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/5 border-b border-white/10 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Ref / Gamer</th>
                    <th className="p-3.5">Zone</th>
                    <th className="p-3.5">Date & Time</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        No bookings recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((b: any) => (
                      <tr key={b.id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5">
                          <p className="font-mono font-bold text-white">{b.bookingRef}</p>
                          <p className="text-[11px] text-slate-400">{b.customerName} ({b.customerPhone})</p>
                        </td>
                        <td className="p-3.5 font-medium">{b.zoneName}</td>
                        <td className="p-3.5">
                          <p className="text-white">{b.bookingDate}</p>
                          <p className="text-[11px] text-slate-400">{b.startTime} - {b.endTime}</p>
                        </td>
                        <td className="p-3.5 font-bold text-white font-['Rajdhani',sans-serif]">
                          ₹{b.totalAmount}
                        </td>
                        <td className="p-3.5">
                          <Badge
                            variant={b.bookingStatus === "CONFIRMED" ? "green" : b.bookingStatus === "CANCELLED" ? "neutral" : "purple"}
                            size="sm"
                          >
                            {b.bookingStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Active Content & Shortcuts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white uppercase font-['Rajdhani',sans-serif]">
              Active Tournaments
            </h3>
            <Link href="/admin/events" className="text-xs text-purple-400 hover:underline">
              Manage &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((e: any) => (
              <GlassCard key={e.id} className="!p-4 border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="sm">{e.game}</Badge>
                  <span className="text-[11px] text-slate-400">{e.eventDate}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-['Rajdhani',sans-serif]">{e.title}</h4>
                <p className="text-[11px] text-slate-400">{e.currentParticipants}/{e.maxParticipants} Registered Gamers</p>
              </GlassCard>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <h3 className="text-lg font-bold text-white uppercase font-['Rajdhani',sans-serif]">
              Active Promos
            </h3>
            <Link href="/admin/offers" className="text-xs text-purple-400 hover:underline">
              CMS &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {activeOffers.map((o: any) => (
              <GlassCard key={o.id} className="!p-4 border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-pink-300">{o.code}</span>
                  <Badge variant="pink" size="sm">
                    {o.discountType === "PERCENTAGE" ? `${o.discountValue}%` : `₹${o.discountValue}`} OFF
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-white">{o.title}</p>
                <p className="text-[11px] text-slate-400">Valid till {o.endDate}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
