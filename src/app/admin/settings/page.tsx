"use client";
import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import { X } from "lucide-react";
import { BusinessSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    email: "",
    phone: "",
    openingTime: "",
    closingTime: "",
    tagline: "",
    googleMapsUrl: "",
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data.settings);
      if (data.settings) {
        setFormData({
          businessName: data.settings.businessName || "",
          address: data.settings.address || "",
          email: data.settings.email || "",
          phone: data.settings.phone || "",
          openingTime: data.settings.openingTime || "",
          closingTime: data.settings.closingTime || "",
          tagline: data.settings.tagline || "",
          googleMapsUrl: data.settings.googleMapsUrl || "",
        });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleOpenEdit = () => {
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchSettings();
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  if (isLoading) return <div className="text-slate-400">Loading settings…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="purple" size="sm">SETTINGS</Badge>
        <h1 className="text-2xl font-black uppercase text-white font-['Rajdhani',sans-serif]">
          Business Settings
        </h1>
        <LiquidGlassButton variant="primary" size="sm" onClick={handleOpenEdit}>
          Edit Settings
        </LiquidGlassButton>
      </div>

      {settings && (
        <GlassCard>
          <div className="space-y-2">
            <p className="text-white"><strong>Business Name:</strong> {settings.businessName}</p>
            <p className="text-white"><strong>Address:</strong> {settings.address}</p>
            <p className="text-white"><strong>Email:</strong> {settings.email}</p>
            <p className="text-white"><strong>Phone:</strong> {settings.phone}</p>
            <p className="text-white"><strong>Opening Time:</strong> {settings.openingTime}</p>
            <p className="text-white"><strong>Closing Time:</strong> {settings.closingTime}</p>
            {settings.googleMapsUrl && (
              <p className="text-white"><strong>Google Maps URL:</strong>{" "}
                <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 underline break-all">{settings.googleMapsUrl}</a>
              </p>
            )}
          </div>
        </GlassCard>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 space-y-5 relative border border-white/15">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5">
              <X className="w-5 h-5" />
            </button>
            <Badge variant="purple" size="sm">EDIT SETTINGS</Badge>
            <h3 className="text-xl font-black uppercase text-white font-['Rajdhani',sans-serif]">Update Business Information</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="glass-input"
                  />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="glass-input"
                  />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Opening Time</label>
                <input
                  type="text"
                  placeholder="e.g. 11:00 AM"
                  value={formData.openingTime}
                  onChange={e => setFormData({ ...formData, openingTime: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Closing Time</label>
                <input
                  type="text"
                  placeholder="e.g. 11:00 PM"
                  value={formData.closingTime}
                  onChange={e => setFormData({ ...formData, closingTime: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                <textarea
                  rows={2}
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Google Maps URL (for "Get Directions" link)</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={formData.googleMapsUrl}
                  onChange={e => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  className="glass-input"
                />
              </div>
              <LiquidGlassButton type="submit" variant="primary" size="sm">Save Settings</LiquidGlassButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
