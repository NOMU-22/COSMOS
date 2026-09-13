"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import { Tag, Plus, Edit, Trash2, CheckCircle, Clock, X } from "lucide-react";
import { Offer } from "@/types";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 20,
    applicableZone: "",
    minDurationHours: 1,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    terms: "",
    status: "PUBLISHED",
  });

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/offers");
      const data = await res.json();
      setOffers(data.offers || []);
    } catch (error) {
      console.error("Failed to load offers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setFormData({
      title: "",
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 20,
      applicableZone: "",
      minDurationHours: 1,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      terms: "",
      status: "PUBLISHED",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      code: offer.code,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      applicableZone: offer.applicableZone || "",
      minDurationHours: offer.minDurationHours || 1,
      startDate: offer.startDate,
      endDate: offer.endDate,
      terms: offer.terms || "",
      status: offer.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingOffer ? "PUT" : "POST";
      const payload = editingOffer ? { id: editingOffer.id, ...formData } : formData;

      const res = await fetch("/api/admin/offers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchOffers();
      }
    } catch (error) {
      console.error("Failed to save offer:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`/api/admin/offers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchOffers();
      }
    } catch (error) {
      console.error("Failed to delete offer:", error);
    }
  };

  const handleToggleStatus = async (offer: Offer) => {
    const nextStatus = offer.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await fetch("/api/admin/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: offer.id, status: nextStatus }),
      });
      fetchOffers();
    } catch (error) {
      console.error("Failed to toggle offer status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="sm">OFFERS CMS</Badge>
          <h1 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
            Promotions & Coupon Management
          </h1>
          <p className="text-xs text-slate-400">
            Publish, edit, schedule, or disable promotions. Published offers instantly appear on the website.
          </p>
        </div>

        <LiquidGlassButton variant="primary" size="sm" onClick={handleOpenCreate} icon={<Plus className="w-3.5 h-3.5" />}>
          Create New Offer
        </LiquidGlassButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 py-16 text-center text-xs text-slate-400">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-xs text-slate-400">No offers found. Create your first offer.</div>
        ) : (
          offers.map((o) => (
            <GlassCard key={o.id} className="border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={o.status === "PUBLISHED" ? "green" : "neutral"} size="sm">
                    {o.status}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-pink-400">{o.code}</span>
                </div>

                <h3 className="text-lg font-bold text-white font-['Rajdhani',sans-serif]">
                  {o.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {o.description}
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-400" />
                  <span>Valid: {o.startDate} to {o.endDate}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => handleToggleStatus(o)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  {o.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(o)}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(o.id)}
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

      {/* Offer Form Modal */}
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
              <Badge variant="purple" size="sm">OFFER CMS</Badge>
              <h3 className="text-xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                {editingOffer ? "Edit Offer" : "Create New Promotion"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Monsoon Squad 20% Off"
                  className="glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SQUAD20"
                    className="glass-input font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="glass-input"
                  >
                    <option value="PERCENTAGE" className="bg-[#0e0e18]">Percentage (%)</option>
                    <option value="FLAT" className="bg-[#0e0e18]">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                    placeholder="20"
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Publish Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="glass-input"
                  >
                    <option value="PUBLISHED" className="bg-[#0e0e18]">Published (Visible on site)</option>
                    <option value="DRAFT" className="bg-[#0e0e18]">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Offer details and player benefits"
                  className="glass-input resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Terms & Conditions
                </label>
                <input
                  type="text"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  placeholder="e.g. Min 3 players required. Valid Mon-Thu."
                  className="glass-input"
                />
              </div>

              <LiquidGlassButton type="submit" variant="primary" fullWidth size="md">
                Save & Publish to Live Site
              </LiquidGlassButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
