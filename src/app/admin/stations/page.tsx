/* Admin Stations Management Page */
"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { Station } from "@/types";

export default function AdminStationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [formData, setFormData] = useState({
    zoneId: "",
    stationNumber: 1,
    name: "",
    status: "AVAILABLE" as "AVAILABLE" | "MAINTENANCE" | "RESERVED",
  });

  const fetchStations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/stations");
      const data = await res.json();
      setStations(data.stations || []);
    } catch (error) {
      console.error("Failed to load stations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const openCreate = () => {
    setEditingStation(null);
    setFormData({ zoneId: "", stationNumber: 1, name: "", status: "AVAILABLE" });
    setIsModalOpen(true);
  };

  const openEdit = (s: Station) => {
    setEditingStation(s);
    setFormData({
      zoneId: s.zoneId,
      stationNumber: s.stationNumber,
      name: s.name,
      status: s.status as any,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingStation ? "PUT" : "POST";
    const payload = editingStation ? { id: editingStation.id, ...formData } : formData;
    try {
      const res = await fetch("/api/admin/stations", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchStations();
      }
    } catch (err) {
      console.error("Failed to save station:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this station permanently?")) return;
    try {
      const res = await fetch(`/api/admin/stations?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchStations();
    } catch (err) {
      console.error("Failed to delete station:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="sm">STATIONS CMS</Badge>
          <h1 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
            Manage Gaming Stations
          </h1>
          <p className="text-xs text-slate-400">
            Create, edit or retire station slots across all zones.
          </p>
        </div>
        <LiquidGlassButton variant="primary" size="sm" onClick={openCreate} icon={<Plus className="w-3.5 h-3.5" />}>Add Station</LiquidGlassButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stations.map((s) => (
          <GlassCard key={s.id} className="border-white/10 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white font-['Rajdhani',sans-serif]">{s.name || `Station ${s.stationNumber}`}</h3>
              <p className="text-xs text-slate-300">Zone: {s.zoneId}</p>
              <p className="text-xs text-slate-300">Slot #: {s.stationNumber}</p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2">
              <Badge variant="purple" size="sm" className="!text-[10px]">{s.status}</Badge>
              <button onClick={() => openEdit(s)} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/50 text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-5 relative border border-white/15 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5">
              <X className="w-5 h-5" />
            </button>
            <div>
              <Badge variant="purple" size="sm">STATIONS CMS</Badge>
              <h3 className="text-xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                {editingStation ? "Edit Station" : "Create Station"}
              </h3>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Zone ID *</label>
                <input
                  type="text"
                  required
                  value={formData.zoneId}
                  onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                  placeholder="e.g. zone-169837"
                  className="glass-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Station Number *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.stationNumber}
                    onChange={(e) => setFormData({ ...formData, stationNumber: parseInt(e.target.value) })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="glass-input"
                  >
                    <option value="AVAILABLE" className="bg-[#0e0e18]">AVAILABLE</option>
                    <option value="MAINTENANCE" className="bg-[#0e0e18]">MAINTENANCE</option>
                    <option value="RESERVED" className="bg-[#0e0e18]">RESERVED</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Station Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. PS5 Station #3"
                  className="glass-input"
                />
              </div>
              <LiquidGlassButton type="submit" variant="primary" fullWidth size="md">Save Station</LiquidGlassButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
