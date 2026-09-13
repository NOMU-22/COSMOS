"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar,
  Clock,
  Search,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { Booking, GamingZone } from "@/types";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [zones, setZones] = useState<GamingZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Manual Booking Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    zoneId: "",
    bookingDate: new Date().toISOString().split("T")[0],
    startTime: "16:00",
    durationHours: 1,
    playersCount: 1,
    totalAmount: 149,
    paymentMethod: "UPI",
    paymentStatus: "COMPLETED",
    bookingStatus: "CONFIRMED",
    specialRequests: "",
  });

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      let url = "/api/admin/bookings?";
      if (filterDate) url += `date=${filterDate}&`;
      if (filterStatus) url += `status=${filterStatus}&`;

      const [resB, resZ] = await Promise.all([
        fetch(url),
        fetch("/api/public/data"),
      ]);

      const dataB = await resB.json();
      const dataZ = await resZ.json();

      setBookings(dataB.bookings || []);
      setZones(dataZ.zones || []);
      if (dataZ.zones && dataZ.zones.length > 0 && !formData.zoneId) {
        setFormData((prev) => ({ ...prev, zoneId: dataZ.zones[0].id, totalAmount: dataZ.zones[0].hourlyRate }));
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterDate, filterStatus]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, bookingStatus: newStatus }),
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchBookings();
      }
    } catch (error) {
      console.error("Failed to create walk-in:", error);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.bookingRef.toLowerCase().includes(term) ||
      b.customerName.toLowerCase().includes(term) ||
      b.customerPhone.includes(term) ||
      b.zoneName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="sm">CMS BOOKINGS</Badge>
          <h1 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
            Slot & Booking Management
          </h1>
          <p className="text-xs text-slate-400">
            View, filter, manage, and create manual walk-in gaming sessions
          </p>
        </div>

        <LiquidGlassButton
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Walk-in Booking
        </LiquidGlassButton>
      </div>

      {/* Filter Bar */}
      <GlassCard className="!p-4 border-white/10 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex-1 min-w-[200px] relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Ref, Gamer Name, Phone..."
            className="glass-input !py-2 pl-8"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="glass-input !py-2"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-slate-400 hover:text-white text-xs px-2"
            >
              Clear Date
            </button>
          )}
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="glass-input !py-2 !w-auto"
        >
          <option value="" className="bg-[#0e0e18]">All Statuses</option>
          <option value="CONFIRMED" className="bg-[#0e0e18]">Confirmed</option>
          <option value="COMPLETED" className="bg-[#0e0e18]">Completed</option>
          <option value="CANCELLED" className="bg-[#0e0e18]">Cancelled</option>
        </select>
      </GlassCard>

      {/* Bookings Table */}
      <GlassCard className="!p-0 border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Ref</th>
                <th className="p-3.5">Customer / Contact</th>
                <th className="p-3.5">Zone & Station</th>
                <th className="p-3.5">Schedule</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Loading bookings database...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-mono font-bold text-purple-300">
                      {b.bookingRef}
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-white">{b.customerName}</p>
                      <p className="text-[11px] text-slate-400">{b.customerPhone}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="text-white font-medium">{b.zoneName}</p>
                      <p className="text-[11px] text-slate-400">Station #{b.stationNumber} ({b.playersCount} players)</p>
                    </td>
                    <td className="p-3.5">
                      <p className="text-white">{b.bookingDate}</p>
                      <p className="text-[11px] text-purple-400">{b.startTime} – {b.endTime}</p>
                    </td>
                    <td className="p-3.5 font-bold text-white font-['Rajdhani',sans-serif]">
                      ₹{b.totalAmount}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={b.paymentStatus === "COMPLETED" ? "green" : "neutral"} size="sm">
                        {b.paymentMethod} • {b.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={b.bookingStatus === "CONFIRMED" ? "purple" : b.bookingStatus === "COMPLETED" ? "green" : "neutral"}
                        size="sm"
                      >
                        {b.bookingStatus}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={b.bookingStatus}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[11px] text-slate-300"
                      >
                        <option value="CONFIRMED" className="bg-[#0e0e18]">Confirmed</option>
                        <option value="COMPLETED" className="bg-[#0e0e18]">Completed</option>
                        <option value="CANCELLED" className="bg-[#0e0e18]">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Manual Walk-in Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 space-y-5 relative border border-white/15">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <Badge variant="purple" size="sm">MANUAL BOOKING</Badge>
              <h3 className="text-xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                Create Walk-In Session
              </h3>
            </div>

            <form onSubmit={handleCreateWalkIn} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gamer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Walk-in Gamer"
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gaming Zone *
                  </label>
                  <select
                    value={formData.zoneId}
                    onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                    className="glass-input"
                  >
                    {zones.map((z) => (
                      <option key={z.id} value={z.id} className="bg-[#0e0e18]">
                        {z.name} (₹{z.hourlyRate}/hr)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.bookingDate}
                    onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration (Hrs)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={formData.durationHours}
                    onChange={(e) => setFormData({ ...formData, durationHours: parseInt(e.target.value, 10) })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                    className="glass-input"
                  />
                </div>
              </div>

              <LiquidGlassButton type="submit" variant="primary" fullWidth size="md">
                Lock Walk-In Booking
              </LiquidGlassButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
