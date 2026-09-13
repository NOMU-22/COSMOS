"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import { Trophy, Plus, Edit, Trash2, Users, X } from "lucide-react";
import { EventTournament, EventRegistration } from "@/types";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventTournament[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventTournament | null>(null);
  const [selectedEventForRegs, setSelectedEventForRegs] = useState<EventTournament | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    game: "EA Sports FC 26 (PS5)",
    category: "TOURNAMENT",
    eventDate: new Date().toISOString().split("T")[0],
    startTime: "13:30",
    entryFee: 299,
    prizePool: "🏆 Winner: ₹10,000 Scholarship | 🥈 Runner-Up: ₹5,000 Scholarship",
    maxParticipants: 32,
    format: "PS5 | 1v1 | Single Elimination",
    rules: "Default competitive squads. 5 min halves. Tactical defending.",
    bannerUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    status: "REGISTRATION_OPEN",
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      setEvents(data.events || []);
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      game: "EA Sports FC 26 (PS5)",
      category: "TOURNAMENT",
      eventDate: new Date().toISOString().split("T")[0],
      startTime: "14:00",
      entryFee: 299,
      prizePool: "",
      maxParticipants: 32,
      format: "PS5 | 1v1 | Knockout",
      rules: "",
      bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      status: "REGISTRATION_OPEN",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: EventTournament) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      game: event.game,
      category: event.category,
      eventDate: event.eventDate,
      startTime: event.startTime,
      entryFee: event.entryFee,
      prizePool: event.prizePool || "",
      maxParticipants: event.maxParticipants,
      format: event.format,
      rules: event.rules || "",
      bannerUrl: event.bannerUrl || "",
      status: event.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingEvent ? "PUT" : "POST";
      const payload = editingEvent ? { id: editingEvent.id, ...formData } : formData;

      const res = await fetch("/api/admin/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tournament and all registrations?")) return;
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="purple" size="sm">TOURNAMENTS CMS</Badge>
          <h1 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
            Championships & Events Manager
          </h1>
          <p className="text-xs text-slate-400">
            Publish esports cups, configure prize pools, entry fees, and manage player roster
          </p>
        </div>

        <LiquidGlassButton variant="primary" size="sm" onClick={handleOpenCreate} icon={<Plus className="w-3.5 h-3.5" />}>
          Create Tournament
        </LiquidGlassButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => {
          const eventRegs = registrations.filter((r) => r.eventId === event.id);

          return (
            <GlassCard key={event.id} className="border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={event.status === "REGISTRATION_OPEN" ? "green" : "purple"} size="sm">
                    {event.status.replace("_", " ")}
                  </Badge>
                  <span className="text-xs font-bold text-white">Entry: ₹{event.entryFee}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-['Rajdhani',sans-serif]">{event.title}</h3>
                  <p className="text-xs text-purple-300 font-semibold">{event.game} • {event.format}</p>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1 text-xs text-slate-300">
                  <p><strong className="text-amber-300">Prize Pool: </strong>{event.prizePool || "None specified"}</p>
                  <p className="text-[11px] text-slate-400">Date: {event.eventDate} at {event.startTime}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">
                    Registered: <strong className="text-white">{eventRegs.length}</strong> / {event.maxParticipants}
                  </span>
                  <button
                    onClick={() => setSelectedEventForRegs(event)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-bold underline flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Registered Players ({eventRegs.length})</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                <button onClick={() => handleOpenEdit(event)} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(event.id)} className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/50 text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Registrations Roster Modal */}
      {selectedEventForRegs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 space-y-5 relative border border-white/15 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setSelectedEventForRegs(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5">
              <X className="w-5 h-5" />
            </button>

            <div>
              <Badge variant="purple" size="sm">TOURNAMENT ROSTER</Badge>
              <h3 className="text-xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                {selectedEventForRegs.title}
              </h3>
              <p className="text-xs text-slate-400">{selectedEventForRegs.game}</p>
            </div>

            <div className="space-y-2">
              {registrations.filter((r) => r.eventId === selectedEventForRegs.id).length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 text-center">No participants registered yet.</p>
              ) : (
                registrations
                  .filter((r) => r.eventId === selectedEventForRegs.id)
                  .map((r, i) => (
                    <div key={r.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">#{i + 1} {r.playerName} {r.gamerTag ? `(${r.gamerTag})` : ""}</p>
                        <p className="text-[11px] text-slate-400">Phone: {r.playerPhone} {r.playerEmail ? `• ${r.playerEmail}` : ""}</p>
                      </div>
                      <Badge variant="green" size="sm">{r.paymentStatus}</Badge>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 space-y-5 relative border border-white/15 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5">
              <X className="w-5 h-5" />
            </button>

            <div>
              <Badge variant="purple" size="sm">EVENT CMS</Badge>
              <h3 className="text-xl font-black uppercase text-white font-['Rajdhani',sans-serif] mt-1">
                {editingEvent ? "Edit Tournament" : "Create New Tournament"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tournament Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. COSMOS FC 26 MONSOON CUP"
                  className="glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Game Platform *</label>
                  <input
                    type="text"
                    required
                    value={formData.game}
                    onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                    placeholder="EA Sports FC 26 (PS5)"
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Format</label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    placeholder="PS5 | 1v1 | Knockout"
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Entry Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.entryFee}
                    onChange={(e) => setFormData({ ...formData, entryFee: parseFloat(e.target.value) })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Prize Pool Description</label>
                <input
                  type="text"
                  value={formData.prizePool}
                  onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                  placeholder="Winner: ₹10,000 Scholarship"
                  className="glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tournament Rules</label>
                <textarea
                  rows={2}
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  placeholder="5 min halves, default competitive squads"
                  className="glass-input resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Players</label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value, 10) })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="glass-input"
                  >
                    <option value="REGISTRATION_OPEN" className="bg-[#0e0e18]">Registration Open</option>
                    <option value="UPCOMING" className="bg-[#0e0e18]">Upcoming</option>
                    <option value="COMPLETED" className="bg-[#0e0e18]">Completed</option>
                    <option value="DRAFT" className="bg-[#0e0e18]">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <LiquidGlassButton type="submit" variant="primary" fullWidth size="md">
                Save & Publish Tournament
              </LiquidGlassButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
