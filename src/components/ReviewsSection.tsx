"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { GlassCard } from "./ui/GlassCard";
import { LiquidGlassButton } from "./ui/LiquidGlassButton";
import { Badge } from "./ui/Badge";
import { Star, MessageSquare, Plus, CheckCircle, X } from "lucide-react";

export default function ReviewsSection() {
  const { reviews, isLoading, refreshData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    authorName: "",
    rating: 5,
    comment: "",
    gamePlayed: "FC 26 (PS5)",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        refreshData();
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoading && reviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-3 max-w-2xl">
          <Badge variant="purple" size="md">
            AUTHENTIC COMMUNITY FEEDBACK
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-['Rajdhani',sans-serif]">
            Verified Gamer Reviews
          </h2>
          <p className="text-sm text-slate-300">
            Real feedback from gamers who play and compete at Cosmos Gaming Mumbai.
          </p>
        </div>

        <LiquidGlassButton
          variant="secondary"
          size="sm"
          onClick={() => {
            setIsModalOpen(true);
            setSubmitted(false);
          }}
          icon={<Plus className="w-4 h-4 text-purple-400" />}
        >
          Leave a Review
        </LiquidGlassButton>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card h-48 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <GlassCard key={rev.id} className="space-y-4 border-white/10 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{rev.authorName}</p>
                  {rev.gamePlayed && (
                    <p className="text-[11px] text-purple-400 font-medium">
                      Played {rev.gamePlayed}
                    </p>
                  )}
                </div>
                <Badge variant="purple" size="sm">
                  Verified Gamer
                </Badge>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Leave a review modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-5 relative border border-white/15">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <Badge variant="purple" size="sm">
                SHARE YOUR EXPERIENCE
              </Badge>
              <h3 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                Cosmos Gaming Feedback
              </h3>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-center space-y-3">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold">Thank you for your review!</p>
                <LiquidGlassButton
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </LiquidGlassButton>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="e.g. Sameer Khan"
                    className="glass-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Rating (1-5 Stars) *
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) })}
                      className="glass-input"
                    >
                      <option value="5" className="bg-[#0e0e18]">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4" className="bg-[#0e0e18]">⭐⭐⭐⭐ (4/5)</option>
                      <option value="3" className="bg-[#0e0e18]">⭐⭐⭐ (3/5)</option>
                      <option value="2" className="bg-[#0e0e18]">⭐⭐ (2/5)</option>
                      <option value="1" className="bg-[#0e0e18]">⭐ (1/5)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Game Setup Played
                    </label>
                    <input
                      type="text"
                      value={formData.gamePlayed}
                      onChange={(e) => setFormData({ ...formData, gamePlayed: e.target.value })}
                      placeholder="e.g. Valorant / PS5"
                      className="glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Feedback *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="How was the equipment, latency, atmosphere, and staff?"
                    className="glass-input resize-none"
                  />
                </div>

                <LiquidGlassButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                  icon={<MessageSquare className="w-4 h-4" />}
                >
                  {isSubmitting ? "Submitting..." : "SUBMIT REVIEW"}
                </LiquidGlassButton>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
