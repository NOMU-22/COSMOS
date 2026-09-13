"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import { Gamepad2, Plus, Edit, Trash2, X, Star } from "lucide-react";
import { Game } from "@/types";

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    genre: "Sports / Football",
    zoneType: "PS5",
    coverUrl: "",
    coverFile: null as File | null,
    isPopular: false,
    description: "",
  });

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/games");
      const data = await res.json();
      setGames(data.games || []);
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleOpenCreate = () => {
    setEditingGame(null);
    setFormData({
      title: "",
      genre: "Sports / Football",
      zoneType: "PS5",
      coverUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80",
      coverFile: null,
      isPopular: false,
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (g: Game) => {
    setEditingGame(g);
    setFormData({
      title: g.title,
      genre: g.genre,
      zoneType: g.zoneType,
      coverUrl: g.coverUrl,
      coverFile: null,
      isPopular: g.isPopular,
      description: g.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingGame ? "PUT" : "POST";

      // Determine if we need to upload a file
      if (formData.coverFile) {
        const form = new FormData();
        form.append("title", formData.title);
        form.append("genre", formData.genre);
        form.append("zoneType", formData.zoneType);
        form.append("isPopular", String(formData.isPopular));
        form.append("description", formData.description);
        form.append("coverFile", formData.coverFile);
        if (editingGame) form.append("id", editingGame.id);

        const res = await fetch("/api/admin/games", {
          method,
          body: form,
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchGames();
        }
        return;
      }

      // No file upload, send JSON payload
      const payload = editingGame ? { id: editingGame.id, ...formData } : formData;
      const res = await fetch("/api/admin/games", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchGames();
      }
    } catch (error) {
      console.error("Failed to save game:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this game from library?")) return;
    try {
      const res = await fetch(`/api/admin/games?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchGames();
    } catch (error) {
      console.error("Failed to delete game:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="sm">GAMES CMS</Badge>
          <h1 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
            Game Library Management
          </h1>
          <p className="text-xs text-slate-400">
            Add games, assign platform zones, and highlight popular titles
          </p>
        </div>

        <LiquidGlassButton variant="primary" size="sm" onClick={handleOpenCreate} icon={<Plus className="w-3.5 h-3.5" />}>
          Add Game
        </LiquidGlassButton>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {games.map((g) => (
          <GlassCard key={g.id} className="!p-3 border-white/10 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="relative h-32 w-full rounded-xl overflow-hidden">
                <Image src={g.coverUrl} alt={g.title} fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge variant="purple" size="sm" className="!text-[10px]">{g.zoneType}</Badge>
                </div>
                {g.isPopular && (
                  <div className="absolute top-2 left-2 bg-amber-500/80 backdrop-blur-md p-1 rounded-md text-white">
                    <Star className="w-3 h-3 fill-white" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-white font-['Rajdhani',sans-serif] truncate">
                  {g.title}
                </h4>
                <p className="text-[10px] text-slate-400">{g.genre}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-1.5">
              <button onClick={() => handleOpenEdit(g)} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300">
                <Edit className="w-3 h-3" />
              </button>
              <button onClick={() => handleDelete(g.id)} className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/50 text-red-400">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Game Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-5 relative border border-white/15">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5">
              <X className="w-5 h-5" />
            </button>

            <div>
              <Badge variant="purple" size="sm">GAMES CMS</Badge>
              <h3 className="text-xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                {editingGame ? "Edit Game" : "Add Game to Library"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Game Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. EA Sports FC 26"
                  className="glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Genre</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Sports / FPS"
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Zone Type</label>
                  <select
                    value={formData.zoneType}
                    onChange={(e) => setFormData({ ...formData, zoneType: e.target.value })}
                    className="glass-input"
                  >
                    <option value="PS5" className="bg-[#0e0e18]">PS5</option>
                    <option value="PC" className="bg-[#0e0e18]">PC</option>
                    <option value="VR" className="bg-[#0e0e18]">VR</option>
                    <option value="RACING" className="bg-[#0e0e18]">Racing Sim</option>
                    <option value="ALL" className="bg-[#0e0e18]">All Zones</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                  className="glass-input text-xs font-mono"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="rounded bg-white/10 border-white/20 text-purple-600"
                />
                <span className="text-slate-300">Mark as Popular / Featured Title</span>
              </label>

              <LiquidGlassButton type="submit" variant="primary" fullWidth size="md">
                Save to Game Library
              </LiquidGlassButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
