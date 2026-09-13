"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import { Cpu, Plus, Edit, Trash2, X } from "lucide-react";
import { GamingZone, Station } from "@/types";

export default function AdminZonesPage() {
  const [zones, setZones] = useState<GamingZone[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<GamingZone | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    specs: "",
    hourlyRate: 149,
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
    totalStations: 4,
    popularGames: "FIFA, Valorant, GTA 5",
    displayOrder: 1,
  });

  const fetchZones = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/zones");
      const data = await res.json();
      setZones(data.zones || []);
      setStations(data.stations || []);
    } catch (error) {
      console.error("Failed to load zones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleOpenCreate = () => {
    setEditingZone(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      specs: "",
      hourlyRate: 149,
      imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
      totalStations: 4,
      popularGames: "",
      displayOrder: zones.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (zone: GamingZone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      slug: zone.slug,
      description: zone.description,
      specs: zone.specs,
      hourlyRate: zone.hourlyRate,
      imageUrl: zone.imageUrl,
      totalStations: zone.totalStations,
      popularGames: zone.popularGames,
      displayOrder: zone.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingZone ? "PUT" : "POST";
      const payload = editingZone ? { id: editingZone.id, ...formData } : formData;

      const res = await fetch("/api/admin/zones", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchZones();
      }
    } catch (error) {
      console.error("Failed to save zone:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gaming zone and all its station slots?")) return;
    try {
      const res = await fetch(`/api/admin/zones?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchZones();
    } catch (error) {
      console.error("Failed to delete zone:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="sm">GAMING ZONES CMS</Badge>
          <h1 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
            Gaming Setups & Rigs Configuration
          </h1>
          <p className="text-xs text-slate-400">
            Manage PS5, PC, VR, and Simulator arenas, station counts, and hardware specs
          </p>
        </div>

        <LiquidGlassButton variant="primary" size="sm" onClick={handleOpenCreate} icon={<Plus className="w-3.5 h-3.5" />}>
          Add Gaming Zone
        </LiquidGlassButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone) => {
          const zoneStations = stations.filter((s) => s.zoneId === zone.id);

          return (
            <GlassCard key={zone.id} className="border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white font-['Rajdhani',sans-serif]">{zone.name}</h3>
                  <Badge variant="purple" size="sm">₹{zone.hourlyRate}/hr</Badge>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{zone.description}</p>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-400">
                  <strong className="text-purple-300">Specs: </strong>{zone.specs}
                </div>

                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Configured Stations ({zoneStations.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {zoneStations.map((s) => (
                      <span key={s.id} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">
                        #{s.stationNumber} {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{zone.popularGames}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenEdit(zone)} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(zone.id)} className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/50 text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Zone Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 space-y-5 relative border border-white/15 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5">
              <X className="w-5 h-5" />
            </button>

            <div>
              <Badge variant="purple" size="sm">ZONE CMS</Badge>
              <h3 className="text-xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                {editingZone ? "Edit Gaming Zone" : "Create Gaming Zone"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Zone Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. PlayStation 5 (PS5) Arena"
                  className="glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hourly Base Rate (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Stations Count *</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={formData.totalStations}
                    onChange={(e) => setFormData({ ...formData, totalStations: parseInt(e.target.value, 10) })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hardware Specifications</label>
                <input
                  type="text"
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  placeholder="e.g. PS5 Consoles • 4K HDR 120Hz Displays • DualSense"
                  className="glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="glass-input resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Featured / Popular Games</label>
                <input
                  type="text"
                  value={formData.popularGames}
                  onChange={(e) => setFormData({ ...formData, popularGames: e.target.value })}
                  placeholder="e.g. FC 26, Tekken 8, GTA 5"
                  className="glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="glass-input text-xs font-mono"
                />
              </div>

              <LiquidGlassButton type="submit" variant="primary" fullWidth size="md">
                Save & Update Arena Configuration
              </LiquidGlassButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
