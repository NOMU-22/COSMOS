// src/app/admin/reviews/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import { Edit, Trash2, X, CheckCircle, XCircle, Plus } from "lucide-react";
import { Review } from "@/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const [formData, setFormData] = useState({
    authorName: "",
    rating: 5,
    comment: "",
    gamePlayed: "",
    isVerified: false,
    status: "PENDING" as "APPROVED" | "PENDING" | "REJECTED",
  });

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openCreate = () => {
    setEditingReview(null);
    setFormData({
      authorName: "",
      rating: 5,
      comment: "",
      gamePlayed: "",
      isVerified: false,
      status: "PENDING",
    });
    setIsModalOpen(true);
  };

  const openEdit = (r: Review) => {
    setEditingReview(r);
    setFormData({
      authorName: r.authorName,
      rating: r.rating,
      comment: r.comment,
      gamePlayed: r.gamePlayed || "",
      isVerified: r.isVerified,
      status: r.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingReview ? "PUT" : "POST";
    const payload = editingReview ? { id: editingReview.id, ...formData } : formData;
    try {
      const res = await fetch("/api/admin/reviews", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchReviews();
      }
    } catch (err) {
      console.error("Failed to save review:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="sm">REVIEWS CMS</Badge>
          <h1 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
            Customer Reviews Management
          </h1>
          <p className="text-xs text-slate-400">
            Approve, reject or edit submitted reviews.
          </p>
        </div>
        <LiquidGlassButton variant="primary" size="sm" onClick={openCreate} icon={<Plus className="w-3.5 h-3.5" />}>Add Review</LiquidGlassButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <GlassCard key={r.id} className="border-white/10 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white font-['Rajdhani',sans-serif]">{r.authorName}</h3>
              <p className="text-xs text-slate-300">Rating: {"★".repeat(r.rating)} ({r.rating}/5)</p>
              <p className="text-sm text-slate-200 mt-1 line-clamp-3">{r.comment}</p>
              {r.gamePlayed && <p className="text-xs text-purple-300">Game: {r.gamePlayed}</p>}
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
               <Badge variant={r.status === "APPROVED" ? "green" : r.status === "REJECTED" ? "pink" : "purple"} size="sm" className="!text-[10px]">{r.status}</Badge>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(r)} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/50 text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
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
              <Badge variant="purple" size="sm">REVIEWS CMS</Badge>
              <h3 className="text-xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                {editingReview ? "Edit Review" : "Add Review"}
              </h3>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (1‑5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Game Played (optional)</label>
                  <input
                    type="text"
                    value={formData.gamePlayed}
                    onChange={(e) => setFormData({ ...formData, gamePlayed: e.target.value })}
                    className="glass-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Comment *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="glass-input resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center space-x-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="rounded bg-white/10 border-white/20 text-purple-600"
                  />
                  <span>Verified Buyer</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-300">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="glass-input"
                  >
                    <option value="PENDING" className="bg-[#0e0e18]">PENDING</option>
                    <option value="APPROVED" className="bg-[#0e0e18]">APPROVED</option>
                    <option value="REJECTED" className="bg-[#0e0e18]">REJECTED</option>
                  </select>
                </label>
              </div>
              <LiquidGlassButton type="submit" variant="primary" fullWidth size="md">Save Review</LiquidGlassButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
