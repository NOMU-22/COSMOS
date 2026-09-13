"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import { DollarSign, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { PricingTier } from "@/types";

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    zoneType: "High-End PC Esports",
    durationHours: 1,
    price: 149,
    originalPrice: 180,
    tag: "",
    features: "240Hz High Refresh Display\nMechanical RGB Peripherals\nDiscord Ready",
    isFeatured: false,
    isActive: true,
  });

  const fetchPricing = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      setPricing(data.pricing || []);
    } catch (error) {
      console.error("Failed to load pricing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleOpenCreate = () => {
    setEditingTier(null);
    setFormData({
      title: "",
      zoneType: "High-End PC Esports",
      durationHours: 1,
      price: 149,
      originalPrice: 180,
      tag: "",
      features: "High-Speed LAN\nZero Input Lag\nPeripherals Included",
      isFeatured: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tier: PricingTier) => {
    setEditingTier(tier);
    let feats = "";
    try {
      const parsed = typeof tier.features === "string" ? JSON.parse(tier.features) : tier.features;
      feats = Array.isArray(parsed) ? parsed.join("\n") : "";
    } catch {
      feats = tier.features;
    }

    setFormData({
      title: tier.title,
      zoneType: tier.zoneType,
      durationHours: tier.durationHours,
      price: tier.price,
      originalPrice: tier.originalPrice || 0,
      tag: tier.tag || "",
      features: feats,
      isFeatured: tier.isFeatured,
      isActive: tier.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingTier ? "PUT" : "POST";
      const featsArray = formData.features.split("\n").map((s) => s.trim()).filter(Boolean);

      const payload = {
        ...(editingTier ? { id: editingTier.id } : {}),
        ...formData,
        features: featsArray,
      };

      const res = await fetch("/api/admin/pricing", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPricing();
      }
    } catch (error) {
      console.error("Failed to save pricing:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pricing tier?")) return;
    try {
      const res = await fetch(`/api/admin/pricing?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchPricing();
    } catch (error) {
      console.error("Failed to delete pricing:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="sm">PRICING CMS</Badge>
          <h1 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
            Gaming Rates & Packages
          </h1>
          <p className="text-xs text-slate-400">
            Configure hourly rates and special passes. Any changes update live pricing instantly on the homepage.
          </p>
        </div>

        <LiquidGlassButton variant="primary" size="sm" onClick={handleOpenCreate} icon={<Plus className="w-3.5 h-3.5" />}>
          Add Pricing Tier
        </LiquidGlassButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 py-16 text-center text-xs text-slate-400">Loading pricing tiers...</div>
        ) : (
          pricing.map((p) => (
            <GlassCard key={p.id} className="border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={p.isFeatured ? "purple" : "neutral"} size="sm">
                    {p.tag || `${p.durationHours} Hr Pass`}
                  </Badge>
                  <span className="text-2xl font-black text-white font-['Rajdhani',sans-serif]">
                    ₹{p.price}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-['Rajdhani',sans-serif]">{p.title}</h3>
                  <p className="text-xs text-purple-300 font-semibold">{p.zoneType}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {p.isActive ? "● Active on Website" : "○ Disabled"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/50 text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Pricing Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 space-y-5 relative border border-white/15 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <Badge variant="purple" size="sm">PRICING CMS</Badge>
              <h3 className="text-xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                {editingTier ? "Edit Pricing Tier" : "Create Pricing Tier"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. PC Grind Pass (3 Hours)"
                  className="glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Zone / Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zoneType}
                    onChange={(e) => setFormData({ ...formData, zoneType: e.target.value })}
                    placeholder="e.g. PlayStation 5 (PS5)"
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration (Hours) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    required
                    value={formData.durationHours}
                    onChange={(e) => setFormData({ ...formData, durationHours: parseInt(e.target.value, 10) })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Original Price (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tag / Ribbon (Optional)
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="e.g. Most Popular, Best Value"
                  className="glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Features (1 per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="240Hz Esports Display&#10;Mechanical RGB Peripherals&#10;Discord Ready"
                  className="glass-input resize-none font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-6 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-white/10 border-white/20 text-purple-600"
                  />
                  <span className="text-slate-300">Highlight as Featured Pass</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded bg-white/10 border-white/20 text-purple-600"
                  />
                  <span className="text-slate-300">Active on Website</span>
                </label>
              </div>

              <LiquidGlassButton type="submit" variant="primary" fullWidth size="md">
                Save & Update Website Pricing
              </LiquidGlassButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
