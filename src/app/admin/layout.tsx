"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Gamepad2,
  LayoutDashboard,
  Calendar,
  Users,
  Tag,
  DollarSign,
  Cpu,
  Trophy,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
        Verifying Cosmos Admin Access...
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings Manager", href: "/admin/bookings", icon: Calendar },
    { name: "Customer Directory", href: "/admin/customers", icon: Users },
    { name: "Offers & Promos", href: "/admin/offers", icon: Tag },
    { name: "Pricing & Passes", href: "/admin/pricing", icon: DollarSign },
    { name: "Gaming Zones", href: "/admin/zones", icon: Cpu },
    { name: "Games Library", href: "/admin/games", icon: Gamepad2 },
    { name: "Tournaments & Events", href: "/admin/events", icon: Trophy },
    { name: "Photo Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Customer Reviews", href: "/admin/reviews", icon: MessageSquare },
    { name: "Business Info & Hours", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#07070b] text-slate-200 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0d0d16] border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          <span className="font-['Rajdhani',sans-serif] font-bold text-white uppercase">
            Cosmos CMS
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white/5 text-slate-300"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`w-64 bg-[#0a0a12] border-r border-white/10 flex flex-col justify-between shrink-0 p-4 z-40 transition-all ${
          isSidebarOpen ? "block fixed inset-0 md:relative" : "hidden md:flex"
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Rajdhani',sans-serif] text-base font-black uppercase text-white tracking-wider">
                  Cosmos CMS
                </span>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest -mt-0.5">
                  Owner Portal
                </span>
              </div>
            </Link>
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden text-slate-400 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-purple-600/30 text-white border border-purple-500/50 shadow-[0_0_12px_rgba(139,92,246,0.3)] font-bold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User & Logout */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="px-2">
            <p className="text-xs font-bold text-white">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.email || user.phone}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex-1 py-1.5 text-center rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 font-medium transition-colors"
            >
              Public Site
            </Link>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
