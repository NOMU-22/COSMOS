"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton";
import { Badge } from "@/components/ui/Badge";
import {
  Gamepad2,
  Mail,
  Phone,
  Lock,
  User,
  KeyRound,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [mode, setMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [loginMethod, setLoginMethod] = useState<"EMAIL" | "PHONE">("EMAIL");

  // Form Fields
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Email or Phone
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Phone OTP Flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [devOtpPreview, setDevOtpPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  // Handle Email + Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Login failed");
      } else {
        await refreshUser();
        if (data.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: identifier || phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to send OTP");
      } else {
        setOtpSent(true);
        setDevOtpPreview(data.devOtp);
        setSuccessMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: identifier || phone,
          otp: otpCode,
          name: name || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Invalid OTP code");
      } else {
        await refreshUser();
        router.push("/dashboard");
      }
    } catch (error) {
      setErrorMessage("Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Signup failed");
      } else {
        await refreshUser();
        router.push("/dashboard");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Immersive Dark Gaming Ambient Backdrop */}
      <div className="cosmos-glow-orb w-[600px] h-[600px] bg-purple-600/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
      <div className="cosmos-glow-orb w-[350px] h-[350px] bg-sky-500/15 top-1/4 -left-20" />
      <div className="cosmos-glow-orb w-[350px] h-[350px] bg-pink-500/15 bottom-1/4 -right-20" />

      {/* Centered Glass Login Card */}
      <div className="w-full max-w-md relative z-10 animate-in zoom-in-95 duration-400">
        <GlassCard glow="purple" className="border-white/15 bg-black/60 backdrop-blur-2xl p-8 sm:p-10 space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center justify-center gap-2.5 group mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center border border-white/20 shadow-[0_0_25px_rgba(139,92,246,0.6)] group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-['Rajdhani',sans-serif]">
              Cosmos Gaming
            </h1>
            <p className="text-xs text-purple-300 font-medium">
              {mode === "LOGIN" ? "Sign in to access your bookings & Cosmos XP" : "Create your gamer profile"}
            </p>
          </div>

          {/* Mode Switcher Tabs: Login vs Signup */}
          <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode("LOGIN");
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "LOGIN"
                  ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("SIGNUP");
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "SIGNUP"
                  ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300 animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Developer OTP Helper Banner if available */}
          {devOtpPreview && (
            <div className="p-3 rounded-xl bg-purple-950/70 border border-purple-500/50 text-xs text-purple-200 flex items-center justify-between">
              <span>Demo OTP Preview:</span>
              <span className="font-mono font-bold text-sm bg-purple-900 px-2 py-0.5 rounded text-white tracking-widest">
                {devOtpPreview}
              </span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "LOGIN" && (
            <div className="space-y-4">
              {/* Method Switcher: Email vs Phone OTP */}
              <div className="flex items-center justify-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("EMAIL");
                    setOtpSent(false);
                    setErrorMessage(null);
                  }}
                  className={`pb-1 border-b-2 font-semibold transition-all ${
                    loginMethod === "EMAIL"
                      ? "border-purple-400 text-white"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Email & Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("PHONE");
                    setOtpSent(false);
                    setErrorMessage(null);
                  }}
                  className={`pb-1 border-b-2 font-semibold transition-all ${
                    loginMethod === "PHONE"
                      ? "border-purple-400 text-white"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Phone Number & OTP
                </button>
              </div>

              {loginMethod === "EMAIL" ? (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address or Phone
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="admin@cosmosgaming.com or phone"
                        className="glass-input pl-9"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="glass-input pl-9"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <LiquidGlassButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isLoading}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {isLoading ? "Signing in..." : "SIGN IN TO COSMOS"}
                  </LiquidGlassButton>
                </form>
              ) : !otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      10-Digit Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="glass-input pl-9"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <LiquidGlassButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isLoading}
                    icon={<KeyRound className="w-4 h-4" />}
                  >
                    {isLoading ? "Sending OTP..." : "GET 6-DIGIT OTP"}
                  </LiquidGlassButton>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Enter 6-Digit OTP sent to {identifier}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="glass-input text-center font-mono text-lg tracking-widest"
                    />
                  </div>

                  <LiquidGlassButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isLoading}
                    icon={<ShieldCheck className="w-4 h-4" />}
                  >
                    {isLoading ? "Verifying..." : "VERIFY & ENTER COSMOS"}
                  </LiquidGlassButton>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-purple-400 hover:text-purple-300 underline"
                    >
                      Change Phone Number
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SIGNUP FORM */}
          {mode === "SIGNUP" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="glass-input pl-9"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="glass-input pl-9"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@gmail.com"
                    className="glass-input pl-9"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input pl-9"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <LiquidGlassButton
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
                icon={<Sparkles className="w-4 h-4" />}
              >
                {isLoading ? "Creating Profile..." : "JOIN COSMOS GAMING"}
              </LiquidGlassButton>
            </form>
          )}

          {/* Quick Demo Credentials Footer */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">Quick Test Credentials:</p>
            <p>Admin: <span className="font-mono text-purple-300">admin@cosmosgaming.com</span> / <span className="font-mono text-purple-300">AdminCosmos2026!</span></p>
            <p>Customer: <span className="font-mono text-purple-300">aryan@gamer.com</span> / <span className="font-mono text-purple-300">GamerPass123!</span> or Phone OTP</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
