"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth, AuthProvider } from "../../lib/auth-context";
import { ArrowRight } from "lucide-react";

export function StronixLogo({ className = "w-6 h-6 text-gray-900" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M 144 256 L 27.598 256 L 144 139.598 Z M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z M 0 204.402 L 0 112 L 92.402 112 Z" />
    </svg>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Invalid authentication credentials");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center flex flex-col items-center justify-center p-4 font-sans"
      style={{
        backgroundImage: `url("https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85")`,
      }}
    >
      {/* Subtle white-to-transparent atmospheric overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/45 to-transparent pointer-events-none z-0" />

      {/* Login Card */}
      <div className="relative z-20 w-full max-w-md bg-white/90 backdrop-blur-md border border-[#E6E8E3] rounded-[16px] p-8 shadow-xl space-y-6 animate-fade-up">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-900/5 mb-1 hover:scale-105 transition-transform">
            <StronixLogo className="w-8 h-8 text-[#111827]" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            Sign in to Stronix
          </h1>
          <p className="text-xs text-[#6B7280]">
            Supply chain, made clear.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FBEAEC] border border-[#B8444F]/30 rounded-[8px] text-xs text-[#B8444F] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-[#374151] font-semibold mb-1.5">
              Email address
            </label>
            <input
              type="email"
              placeholder="operator@stronix.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/80 border border-[#E6E8E3] rounded-[10px] text-[#111827] focus:border-[#234A38] focus:outline-none shadow-2xs"
              required
            />
          </div>

          <div>
            <label className="block text-[#374151] font-semibold mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/80 border border-[#E6E8E3] rounded-[10px] text-[#111827] focus:border-[#234A38] focus:outline-none shadow-2xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-[10px] bg-[#234A38] text-white font-semibold text-xs hover:bg-[#193A2A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow-sm"
          >
            {loading ? (
              "Signing in…"
            ) : (
              <>
                Sign in <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Logins */}
        <div className="pt-4 border-t border-[#E6E8E3] space-y-2">
          <div className="text-[11px] text-[#6B7280] text-center uppercase tracking-wider font-semibold">
            Demo Presets
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => fillDemoUser("admin_test@stronix.com")}
              type="button"
              className="px-3 py-2 rounded-[8px] bg-[#EEF4EF] border border-[#DCEADE] text-[#285440] font-semibold hover:bg-[#DCEADE] text-center transition-colors"
            >
              Administrator
            </button>
            <button
              onClick={() => fillDemoUser("customer_test@stronix.com")}
              type="button"
              className="px-3 py-2 rounded-[8px] bg-[#F4F5F1] border border-[#E6E8E3] text-[#374151] font-medium hover:bg-[#E6E8E3] text-center transition-colors"
            >
              Client
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#6B7280]">
          Need an account?{" "}
          <Link href="/register" className="text-[#234A38] font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>

      {/* Rolling Grass Overlay */}
      <img
        src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png"
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
