"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/customers?search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (res.ok) {
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="sm">CUSTOMER DIRECTORY</Badge>
          <h1 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
            Gamer Profiles & Booking Records
          </h1>
          <p className="text-xs text-slate-400">
            Secure private directory of verified gamers, contact lines, total sessions, and lifetime spend
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <GlassCard className="!p-4 border-white/10">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Gamer Name, Verified Phone, Email..."
            className="glass-input !py-2 pl-8 text-xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
        </div>
      </GlassCard>

      {/* Customers Table */}
      <GlassCard className="!p-0 border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Verified Phone</th>
                <th className="p-3.5">Verified Email</th>
                <th className="p-3.5">Total Bookings</th>
                <th className="p-3.5">Lifetime Spend</th>
                <th className="p-3.5">Cosmos XP</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Loading customer directory...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No customers found matching search term.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center text-xs font-black">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="p-3.5">
                      {c.phone ? (
                        <span className="flex items-center gap-1.5 font-mono text-purple-300">
                          <Phone className="w-3 h-3 text-purple-400" />
                          <span>{c.phone}</span>
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {c.email ? (
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3 h-3 text-sky-400" />
                          <span>{c.email}</span>
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="purple" size="sm">
                        {c.totalBookings} Session(s)
                      </Badge>
                    </td>
                    <td className="p-3.5 font-bold text-white font-['Rajdhani',sans-serif]">
                      ₹{c.totalSpent}
                    </td>
                    <td className="p-3.5 text-purple-300 font-semibold font-mono">
                      {c.cosmosXp || 0} XP
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="text-xs text-purple-400 hover:text-purple-300 underline font-semibold"
                      >
                        View Full History &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Customer Full Detail & History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 space-y-6 relative border border-white/15 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <Badge variant="purple" size="sm">CUSTOMER PROFILE</Badge>
              <h3 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                {selectedCustomer.name}
              </h3>
              <p className="text-xs text-slate-400">
                Customer since {new Date(selectedCustomer.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Profile Overview Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Total Spent</p>
                <p className="text-xl font-black text-white font-['Rajdhani',sans-serif]">
                  ₹{selectedCustomer.totalSpent}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Sessions</p>
                <p className="text-xl font-black text-purple-300 font-['Rajdhani',sans-serif]">
                  {selectedCustomer.totalBookings}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Cosmos XP</p>
                <p className="text-xl font-black text-amber-300 font-['Rajdhani',sans-serif]">
                  {selectedCustomer.cosmosXp || 0}
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Verified Mobile Phone:</span>
                <span className="font-mono font-bold text-white">{selectedCustomer.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verified Email Address:</span>
                <span className="font-bold text-white">{selectedCustomer.email || "N/A"}</span>
              </div>
            </div>

            {/* Complete Booking History */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase font-['Rajdhani',sans-serif]">
                Complete Session History ({selectedCustomer.bookings?.length || 0})
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedCustomer.bookings?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No bookings recorded yet.</p>
                ) : (
                  selectedCustomer.bookings?.map((b: any) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{b.zoneName}</span>
                          <span className="font-mono text-[10px] text-purple-300">{b.bookingRef}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {b.bookingDate} • {b.startTime} - {b.endTime}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-white font-['Rajdhani',sans-serif]">₹{b.totalAmount}</p>
                        <Badge
                          variant={b.bookingStatus === "CONFIRMED" ? "purple" : b.bookingStatus === "COMPLETED" ? "green" : "neutral"}
                          size="sm"
                          className="!text-[10px] !py-0 !px-1.5"
                        >
                          {b.bookingStatus}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
