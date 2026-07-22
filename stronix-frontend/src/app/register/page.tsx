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

function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    setError(null);
    try {
      await register({ name, email, password, role });
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
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

      {/* Register Card */}
      <div className="relative z-20 w-full max-w-md bg-white/90 backdrop-blur-md border border-[#E6E8E3] rounded-[16px] p-8 shadow-xl space-y-6 animate-fade-up">
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-900/5 mb-1 hover:scale-105 transition-transform">
            <StronixLogo className="w-8 h-8 text-[#111827]" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            Create an account
          </h1>
          <p className="text-xs text-[#6B7280]">
            Set up operator credentials for Stronix.
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
              Full name
            </label>
            <input
              type="text"
              placeholder="Sarah Connor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/80 border border-[#E6E8E3] rounded-[10px] text-[#111827] focus:border-[#234A38] focus:outline-none shadow-2xs"
              required
            />
          </div>

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

          <div>
            <label className="block text-[#374151] font-semibold mb-1.5">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/80 border border-[#E6E8E3] rounded-[10px] text-[#111827] focus:border-[#234A38] focus:outline-none font-sans shadow-2xs"
            >
              <option value="ADMIN">Administrator</option>
              <option value="CUSTOMER">Customer Client</option>
              <option value="WAREHOUSE_MANAGER">Warehouse Manager</option>
              <option value="DISTRIBUTOR">Distributor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-[10px] bg-[#234A38] text-white font-semibold text-xs hover:bg-[#193A2A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2 font-sans shadow-sm"
          >
            {loading ? (
              "Creating account…"
            ) : (
              <>
                Create account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#6B7280]">
          Already registered?{" "}
          <Link href="/login" className="text-[#234A38] font-semibold hover:underline">
            Sign in here
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

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  );
}
