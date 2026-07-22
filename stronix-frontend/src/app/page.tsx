"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  Truck,
  Lock,
  Layers,
  ChevronDown,
  AlertCircle,
  PackageCheck,
  Database,
  Code2,
  FileCheck,
  Terminal,
  Activity,
  UserCheck,
} from "lucide-react";
import { Spotlight } from "../components/core/spotlight";

export function StronixLogo({ className = "w-6 h-6 text-gray-900" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M 144 256 L 27.598 256 L 144 139.598 Z M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z M 0 204.402 L 0 112 L 92.402 112 Z" />
    </svg>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.href = `/dashboard/orders${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`;
    }
  };

  const workflowSteps = [
    {
      id: 0,
      step: "01",
      title: "Order created",
      desc: "A multi-item order is submitted.",
      ledger: {
        orderId: "SO-1051",
        status: "PENDING",
        total: "₹42,678",
        sku: "Handheld barcode scanner",
        availChange: "Available: 11",
        resvChange: "Reserved: 3",
        note: "32 units requested across order items.",
        tone: "warning",
      },
    },
    {
      id: 1,
      step: "02",
      title: "Stock reserved",
      desc: "Available quantity decreases. Reserved quantity increases.",
      ledger: {
        orderId: "SO-1051",
        status: "RESERVED",
        total: "₹42,678",
        sku: "Handheld barcode scanner",
        availChange: "Available: 11 → 9",
        resvChange: "Reserved: 3 → 5",
        note: "Stock held atomically before confirmation.",
        tone: "success",
      },
    },
    {
      id: 2,
      step: "03",
      title: "Confirmed or cancelled",
      desc: "Confirmation commits the reservation. Cancellation releases it.",
      ledger: {
        orderId: "SO-1051",
        status: "CONFIRMED",
        total: "₹42,678",
        sku: "Handheld barcode scanner",
        availChange: "Available: 9 (Committed)",
        resvChange: "Reserved: 0 (Released to dispatch)",
        note: "Reservation committed. Units assigned to delivery.",
        tone: "success",
      },
    },
    {
      id: 3,
      step: "04",
      title: "Safe rejection",
      desc: "If stock cannot be validated, the transaction rolls back with no negative inventory.",
      ledger: {
        orderId: "SO-1054",
        status: "REJECTED",
        total: "₹50,677",
        sku: "Thermal labels — 100 × 150 mm",
        availChange: "Available: 480 (Unchanged)",
        resvChange: "Reserved: 120 (Unchanged)",
        note: "Confirmation blocked — Inventory remains unchanged.",
        tone: "danger",
      },
    },
  ];

  const faqs = [
    {
      q: "How does Stronix prevent overselling?",
      a: "Stronix reserves stock using an atomic availability guard. A request that cannot reserve the required quantity is rejected without creating negative inventory.",
    },
    {
      q: "What happens when an order is confirmed?",
      a: "Confirmation validates the reservation in a transaction and commits the order state only when the required inventory remains valid.",
    },
    {
      q: "What happens when an order is cancelled?",
      a: "The reservation is released and the quantity returns to available stock after the cancellation transaction succeeds.",
    },
    {
      q: "How is a distributor selected?",
      a: "The assignment logic considers delivery-area coverage, current load or capacity, and service rating. The product view presents the resulting candidate rationale.",
    },
    {
      q: "Is this a complete enterprise supply-chain platform?",
      a: "No. Stronix is intentionally scoped as a strong Phase 1 foundation focused on correct operational state transitions.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#111827] font-sans selection:bg-[#DCEADE] selection:text-[#234A38]">
      {/* SECTION 1 — HERO SECTION (Sky-and-Grass Full Viewport Hero preserved) */}
      <section
        className="relative min-h-[100svh] overflow-hidden bg-cover bg-center flex flex-col justify-between"
        style={{
          backgroundImage: `url("https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/45 to-transparent pointer-events-none z-0" />

        {/* Floating Navbar */}
        <header className="animate-fade-down relative z-20 px-5 sm:px-8 lg:px-10 py-4 sm:py-5 flex items-center justify-between max-w-[1400px] w-full mx-auto">
          <Link href="/" className="flex items-center gap-2.5 text-gray-900 group">
            <StronixLogo className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
            <span className="font-bold tracking-tight text-lg sm:text-xl text-gray-900">
              Stronix
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-700">
            <a href="#product" className="hover:text-gray-900 transition-colors">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">
              How it works
            </a>
            <a href="#why-stronix" className="hover:text-gray-900 transition-colors">
              Why Stronix
            </a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">
              FAQ
            </a>
            <Link href="/login" className="hover:text-gray-900 transition-colors">
              Sign in
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="bg-[#234A38] text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-[#193A2A] transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              Open workspace
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full text-gray-900 hover:bg-gray-900/10 flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute left-4 right-4 top-full rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-gray-200 px-5 py-3 animate-fade-up z-50 text-left shadow-lg">
              <a
                href="#product"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100"
              >
                Product
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100"
              >
                How it works
              </a>
              <a
                href="#why-stronix"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100"
              >
                Why Stronix
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-100"
              >
                FAQ
              </a>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-[15px] text-gray-700 hover:text-gray-900"
              >
                Sign in
              </Link>
            </div>
          )}
        </header>

        <div className="flex-1 min-h-6 sm:min-h-10 lg:min-h-12 shrink-0 z-10" />

        {/* Centered Hero Content */}
        <div className="relative z-20 text-center max-w-3xl mx-auto px-4 space-y-4 sm:space-y-5">
          <div className="animate-fade-up inline-block px-3.5 py-1 rounded-full bg-white/80 border border-gray-200/80 backdrop-blur-sm text-[11px] font-semibold tracking-wider text-[#285440] uppercase shadow-2xs">
            SUPPLY CHAIN OPERATIONS, MADE CLEAR
          </div>

          <h1 className="animate-fade-up [animation-delay:100ms] text-gray-900 font-normal leading-[1.05] tracking-tight text-[40px] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl xl:text-[76px]">
            Keep every order<br className="hidden sm:block" /> moving forward.
          </h1>

          <p className="animate-fade-up [animation-delay:220ms] text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mx-auto font-normal">
            Stronix keeps inventory reservations, order decisions, and delivery assignments clear from the moment an order is created.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="animate-fade-up [animation-delay:340ms] mt-4 sm:mt-5 w-full max-w-xl mx-auto"
          >
            <div className="flex items-center gap-3 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-gray-200/90 pl-5 pr-1.5 py-1.5 shadow-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search an order, SKU, or shipment"
                className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 outline-none py-1.5"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900 text-white hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shrink-0 shadow-sm"
              >
                <ArrowUp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </form>

          <div className="animate-fade-up [animation-delay:420ms] text-[11px] sm:text-xs text-gray-600 font-medium tracking-wide">
            Live inventory reservations &nbsp;·&nbsp; Explainable assignment &nbsp;·&nbsp; Role-aware operations
          </div>

          <div className="animate-fade-up [animation-delay:500ms] flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              href="/dashboard"
              className="bg-[#234A38] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#193A2A] hover:shadow-md transition-all inline-flex items-center gap-2"
            >
              Explore the workflow
            </Link>
            <a
              href="#how-it-works"
              className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300/80 hover:bg-white/60 transition-colors inline-flex items-center gap-1"
            >
              View inventory protection &rarr;
            </a>
          </div>
        </div>

        <div className="flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0 z-10" />

        {/* Dark Browser Preview Mockup */}
        <div
          id="product"
          className="animate-hero-rise [animation-delay:620ms] relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-16 lg:-mb-24"
        >
          <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left">
            <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="bg-[#1a1a1c] rounded-md px-5 py-1 text-[10px] text-white/60 font-mono-numbers tracking-wide">
                app.stronix.demo
              </div>
              <div className="w-12" />
            </div>

            <div className="p-5 sm:p-6 bg-white text-[#111827] font-sans">
              <div className="flex items-center justify-between border-b border-[#E6E8E3] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 bg-[#234A38] rounded-[2px]" />
                  <span className="font-bold text-sm text-[#111827]">Orders</span>
                </div>
                <span className="text-xs text-[#6B7280]">
                  Updated just now
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                <div className="md:col-span-7 space-y-4">
                  <div className="p-3.5 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#111827] font-mono-numbers">
                        SO-1051
                      </div>
                      <div className="text-[11px] text-[#6B7280] mt-0.5">
                        Rao Retail Group
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-0.5 text-[11px] rounded bg-[#FCF3D9] text-[#B7791F] font-semibold">
                        Awaiting confirmation
                      </span>
                      <span className="text-xs font-mono-numbers font-bold text-[#111827]">
                        ₹42,678
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-[#374151] mb-1.5 uppercase tracking-wider">
                      Inventory for this order
                    </div>
                    <div className="bg-[#FAFAF7] border border-[#E6E8E3] rounded-[8px] divide-y divide-[#E6E8E3] text-xs">
                      <div className="p-2.5 flex items-center justify-between">
                        <span className="text-[#111827] font-medium">Handheld barcode scanner</span>
                        <span className="font-mono-numbers font-bold text-[#111827]">2 units</span>
                      </div>
                      <div className="p-2.5 flex items-center justify-between">
                        <span className="text-[#111827] font-medium">Thermal labels</span>
                        <span className="font-mono-numbers font-bold text-[#111827]">60 units</span>
                      </div>
                      <div className="p-2.5 flex items-center justify-between">
                        <span className="text-[#111827] font-medium">Carton sealing tape</span>
                        <span className="font-mono-numbers font-bold text-[#111827]">12 units</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[8px] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7280]">Available stock</span>
                      <span className="font-mono-numbers font-bold text-[#234A38]">11</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7280]">Reserved for this order</span>
                      <span className="font-mono-numbers font-bold text-[#B7791F]">2</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#285440] font-semibold bg-[#EEF4EF] p-2.5 rounded-[8px] border border-[#DCEADE]">
                    <CheckCircle2 className="w-4 h-4 text-[#234A38] shrink-0" />
                    <span>Stock reserved successfully</span>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-2.5">
                  <div className="text-[11px] font-bold text-[#374151] uppercase tracking-wider">
                    Distributor recommendation
                  </div>

                  <div className="p-3.5 bg-[#EEF4EF] border-l-[3px] border-l-[#234A38] border border-[#DCEADE] rounded-[10px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-[#111827]">Aster Last Mile</span>
                      <span className="px-2 py-0.5 text-[10px] bg-[#234A38] text-white rounded font-medium">
                        Selected
                      </span>
                    </div>
                    <div className="text-xs text-[#285440] font-medium">
                      Covers Bengaluru South
                    </div>
                    <div className="text-[11px] text-[#6B7280] font-mono-numbers pt-1 border-t border-[#DCEADE]">
                      44% capacity remaining · 4.9 rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grass Overlay */}
        <img
          src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png"
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
        />
      </section>

      {/* SECTION 2 — PRODUCT PROOF STRIP */}
      <section className="bg-white border-y border-[#E6E8E3] py-8 sm:py-10 relative z-20 shadow-2xs">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 text-center space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#6B7280] font-sans">
            Built for the moments where inventory cannot be guessed.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="flex items-start gap-3 p-4 rounded-[12px] bg-[#FAFAF7] border border-[#E6E8E3] text-left">
              <ShieldCheck className="w-5 h-5 text-[#234A38] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-[#111827]">
                  Atomic inventory reservations
                </div>
                <div className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                  Quantities are held immediately on order creation before payment verification.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-[12px] bg-[#FAFAF7] border border-[#E6E8E3] text-left">
              <FileCheck className="w-5 h-5 text-[#234A38] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-[#111827]">
                  Transaction-safe confirmation
                </div>
                <div className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                  Order confirmations run inside atomic database sessions to guarantee zero double-allocation.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-[12px] bg-[#FAFAF7] border border-[#E6E8E3] text-left">
              <Truck className="w-5 h-5 text-[#234A38] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-[#111827]">
                  Explainable distributor assignment
                </div>
                <div className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                  Logistics candidates are scored and ranked transparently by coverage, load capacity, and rating.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — THE CORE WORKFLOW (#how-it-works) */}
      <section id="how-it-works" className="py-24 lg:py-32 px-4 sm:px-8 max-w-[1240px] mx-auto">
        <div className="text-center space-y-3 mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-[#285440] font-sans">
            HOW IT WORKS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827]">
            One order. A clear outcome at every step.
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563] max-w-xl mx-auto leading-relaxed">
            Stronix makes the inventory impact of an order visible from reservation through fulfilment.
          </p>
        </div>

        {/* Interactive Horizontal Workflow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {workflowSteps.map((s) => {
            const isActive = activeWorkflowStep === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setActiveWorkflowStep(s.id)}
                className={`cursor-pointer p-5 rounded-[14px] border transition-all ${
                  isActive
                    ? "bg-[#EEF4EF] border-[#234A38] shadow-sm"
                    : "bg-white border-[#E6E8E3] hover:border-[#234A38]/40"
                }`}
              >
                <div className="flex items-center justify-between mb-2 font-mono-numbers">
                  <span className={`text-xs font-bold ${isActive ? "text-[#234A38]" : "text-[#6B7280]"}`}>
                    {s.step}
                  </span>
                  {isActive && <span className="h-2 w-2 rounded-full bg-[#234A38]" />}
                </div>
                <h3 className="text-sm font-bold text-[#111827] mb-1 font-sans">
                  {s.title}
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Live Order Ledger Display for Active Step */}
        <div className="bg-white border border-[#E6E8E3] rounded-[16px] p-6 shadow-xs font-sans">
          <div className="flex items-center justify-between border-b border-[#E6E8E3] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm font-mono-numbers text-[#111827]">
                {workflowSteps[activeWorkflowStep].ledger.orderId}
              </span>
              <span className="text-xs text-[#6B7280] font-sans">
                · {workflowSteps[activeWorkflowStep].title}
              </span>
            </div>
            <span
              className={`px-2.5 py-0.5 text-xs rounded font-semibold font-sans ${
                workflowSteps[activeWorkflowStep].ledger.tone === "danger"
                  ? "bg-[#FBEAEC] text-[#B8444F]"
                  : workflowSteps[activeWorkflowStep].ledger.tone === "success"
                  ? "bg-[#EEF4EF] text-[#285440]"
                  : "bg-[#FCF3D9] text-[#B7791F]"
              }`}
            >
              {workflowSteps[activeWorkflowStep].ledger.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px]">
              <div className="text-[#6B7280] font-medium">Line item product</div>
              <div className="font-semibold text-[#111827] mt-0.5">
                {workflowSteps[activeWorkflowStep].ledger.sku}
              </div>
            </div>
            <div className="p-3 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px] font-mono-numbers">
              <div className="text-[#6B7280] font-medium font-sans">Available stock change</div>
              <div className="font-semibold text-[#234A38] mt-0.5">
                {workflowSteps[activeWorkflowStep].ledger.availChange}
              </div>
            </div>
            <div className="p-3 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px] font-mono-numbers">
              <div className="text-[#6B7280] font-medium font-sans">Reserved stock change</div>
              <div className="font-semibold text-[#B7791F] mt-0.5">
                {workflowSteps[activeWorkflowStep].ledger.resvChange}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E6E8E3] text-xs text-[#4B5563] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#234A38] shrink-0" />
            <span>{workflowSteps[activeWorkflowStep].ledger.note}</span>
          </div>
        </div>
      </section>

      {/* SECTION 4 — INVENTORY INTEGRITY */}
      <section className="py-24 lg:py-32 px-4 sm:px-8 max-w-[1240px] mx-auto border-t border-[#E6E8E3]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Text Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-[#285440] font-sans">
              INVENTORY PROTECTION
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
              Stock changes should be explainable, not surprising.
            </h2>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              Every reservation is visible. Every cancellation releases stock. Every failed confirmation leaves the system in a consistent state.
            </p>

            <ul className="space-y-3 pt-2 text-xs font-medium text-[#111827]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#234A38] shrink-0" />
                <span>Reserve quantities before confirmation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#234A38] shrink-0" />
                <span>Track available and reserved stock separately</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#234A38] shrink-0" />
                <span>Reject insufficient stock without partial updates</span>
              </li>
            </ul>
          </div>

          {/* Right Inventory Ledger UI (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 font-sans">
            <div className="bg-white border border-[#E6E8E3] rounded-[16px] overflow-hidden shadow-xs">
              <div className="px-5 py-3.5 bg-[#FAFAF7] border-b border-[#E6E8E3] flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#374151]">
                  Live inventory ledger
                </h3>
                <span className="text-xs font-mono-numbers text-[#6B7280]">
                  3 SKUs tracked
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAFAF7] border-b border-[#E6E8E3] text-[#6B7280] text-[11px] uppercase">
                      <th className="px-4 py-3 font-mono-numbers">SKU</th>
                      <th className="px-4 py-3 text-right font-mono-numbers">Available</th>
                      <th className="px-4 py-3 text-right font-mono-numbers">Reserved</th>
                      <th className="px-4 py-3 text-right font-sans">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E8E3]">
                    <tr className="hover:bg-[#F4F5F1] transition-colors">
                      <td className="px-4 py-3.5 font-mono-numbers font-semibold text-[#111827]">
                        SKU-SCN-201
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono-numbers font-bold text-[#234A38]">
                        11
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono-numbers font-bold text-[#B7791F]">
                        5
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="px-2 py-0.5 text-xs rounded bg-[#EEF4EF] text-[#285440] font-medium">
                          Healthy
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F4F5F1] transition-colors">
                      <td className="px-4 py-3.5 font-mono-numbers font-semibold text-[#111827]">
                        SKU-PALLET-EUR
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono-numbers font-bold text-[#234A38]">
                        8
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono-numbers font-bold text-[#B7791F]">
                        2
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="px-2 py-0.5 text-xs rounded bg-[#FCF3D9] text-[#B7791F] font-semibold">
                          Reorder soon
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F4F5F1] transition-colors">
                      <td className="px-4 py-3.5 font-mono-numbers font-semibold text-[#111827]">
                        SKU-LBL-100
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono-numbers font-bold text-[#234A38]">
                        480
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono-numbers font-bold text-[#B7791F]">
                        120
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="px-2 py-0.5 text-xs rounded bg-[#EEF4EF] text-[#285440] font-medium">
                          Healthy
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quiet Event Feed */}
            <div className="bg-white border border-[#E6E8E3] rounded-[12px] p-4 text-xs font-mono-numbers space-y-2">
              <div className="flex items-center justify-between text-[#B8444F]">
                <span>10:39 &nbsp; Confirmation blocked</span>
                <span className="font-bold">SO-1054</span>
              </div>
              <div className="flex items-center justify-between text-[#B7791F]">
                <span>10:36 &nbsp; Reservation placed</span>
                <span className="font-bold">SO-1051</span>
              </div>
              <div className="flex items-center justify-between text-[#234A38]">
                <span>09:04 &nbsp; Order confirmed</span>
                <span className="font-bold">SO-1048</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — EXPLAINABLE DISTRIBUTOR ASSIGNMENT (#why-stronix) */}
      <section id="why-stronix" className="py-24 lg:py-32 px-4 sm:px-8 max-w-[1240px] mx-auto border-t border-[#E6E8E3]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Ranked Candidate Panel (6 Cols) */}
          <div className="lg:col-span-6 space-y-3 font-sans">
            <div className="bg-white border border-[#E6E8E3] rounded-[16px] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E8E3] pb-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#374151]">
                  Assignment rationale
                </div>
                <span className="text-xs text-[#6B7280] font-sans">Evaluated by coverage & rating</span>
              </div>

              {/* Candidate 1 - Selected */}
              <div className="p-4 bg-[#EEF4EF] border-l-[4px] border-l-[#234A38] border border-[#DCEADE] rounded-[12px] space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-[#111827]">
                    01 &nbsp; Aster Last Mile
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-[#234A38] text-white rounded font-medium">
                    Selected
                  </span>
                </div>
                <div className="text-xs text-[#285440] font-medium">
                  Covers Bengaluru South
                </div>
                <div className="text-xs text-[#6B7280] font-mono-numbers">
                  44% capacity remaining · 4.9 rating
                </div>
              </div>

              {/* Candidate 2 - Eligible */}
              <div className="p-4 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[12px] space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-[#111827]">
                    02 &nbsp; RouteForge Logistics
                  </div>
                </div>
                <div className="text-xs text-[#4B5563]">
                  Covers Bengaluru South
                </div>
                <div className="text-xs text-[#6B7280] font-mono-numbers">
                  50% capacity remaining · 4.7 rating
                </div>
              </div>

              {/* Candidate 3 - Not Eligible */}
              <div className="p-4 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[12px] space-y-1 opacity-70">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm text-[#6B7280]">
                    03 &nbsp; Harborline Distribution
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-[#F4F5F1] text-[#6B7280] rounded font-medium">
                    Not eligible
                  </span>
                </div>
                <div className="text-xs text-[#6B7280]">
                  Does not cover this destination
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-[#285440] font-sans">
              SHIPMENTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
              The selected distributor should never be a mystery.
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              Stronix evaluates service coverage, current capacity, and delivery rating so assignment decisions can be reviewed instead of guessed.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — ONE WORKSPACE, ROLE-AWARE ACCESS */}
      <section className="py-24 lg:py-32 px-4 sm:px-8 max-w-[1240px] mx-auto border-t border-[#E6E8E3]">
        <div className="text-center space-y-3 mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-[#285440] font-sans">
            ACCESS CONTROL
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            Every role sees the work that matters.
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563] max-w-xl mx-auto leading-relaxed">
            Stronix uses role-based access to keep operational views focused on the decisions each team member owns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-[14px] bg-white border border-[#E6E8E3] shadow-xs space-y-2">
            <div className="font-bold text-sm text-[#111827]">Administrator</div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Complete visibility across orders, stock, and activity.
            </p>
          </div>

          <div className="p-5 rounded-[14px] bg-white border border-[#E6E8E3] shadow-xs space-y-2">
            <div className="font-bold text-sm text-[#111827]">Customer</div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Order placement and order status.
            </p>
          </div>

          <div className="p-5 rounded-[14px] bg-white border border-[#E6E8E3] shadow-xs space-y-2">
            <div className="font-bold text-sm text-[#111827]">Supplier</div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Purchase-order and invoice context.
            </p>
          </div>

          <div className="p-5 rounded-[14px] bg-white border border-[#E6E8E3] shadow-xs space-y-2">
            <div className="font-bold text-sm text-[#111827]">Warehouse manager</div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Inventory availability and active reservations.
            </p>
          </div>

          <div className="p-5 rounded-[14px] bg-white border border-[#E6E8E3] shadow-xs space-y-2">
            <div className="font-bold text-sm text-[#111827]">Distributor</div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Shipment assignment and delivery status.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7 — FOUNDATION BUILT FOR CORRECTNESS (Emerald & Cyber Slate + Spotlight) */}
      <section className="py-16 px-4 sm:px-8 max-w-[1240px] mx-auto">
        <div className="relative overflow-hidden bg-[#0b0f19] border border-slate-800 rounded-3xl p-10 md:p-14 shadow-2xl space-y-10 group/spotlight">
          {/* Ambient Radial Background Glow */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

          {/* Green Mouse-Tracking Spotlight Effect */}
          <Spotlight
            className="from-emerald-800 via-emerald-600 to-emerald-400 blur-xl dark:from-emerald-950 dark:via-emerald-600 dark:to-emerald-950"
            size={350}
          />

          {/* Subtle Grid Pattern Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="h-full w-full">
              <defs>
                <pattern
                  id="grid-pattern"
                  width="16"
                  height="16"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 8H8M8 8V0M8 8H16M8 8V16"
                    stroke="currentColor"
                    strokeOpacity="0.3"
                    className="stroke-emerald-400"
                  />
                  <rect
                    x="7"
                    y="7"
                    width="2"
                    height="2"
                    fill="currentColor"
                    fillOpacity="0.25"
                    className="fill-emerald-400"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>

          {/* Headings & Copy */}
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              TECHNICAL FOUNDATION
            </div>
            <h2 className="text-white font-bold tracking-tight text-3xl md:text-4xl">
              A focused foundation, built to be tested.
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Stronix deliberately focuses on the operational foundation: authentication, safe inventory state transitions, payments, and shipment assignment.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {/* Card 1 */}
            <div className="bg-[#131b2e]/80 border border-slate-800 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-[#162038] hover:shadow-xl hover:shadow-emerald-500/5 group">
              <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400 group-hover:border-emerald-400/40 group-hover:text-emerald-300 inline-flex items-center justify-center mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2 group-hover:text-emerald-300 transition-colors">
                Mongoose transactions
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Confirmation and cancellation are handled as atomic state changes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#131b2e]/80 border border-slate-800 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-[#162038] hover:shadow-xl hover:shadow-emerald-500/5 group">
              <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400 group-hover:border-emerald-400/40 group-hover:text-emerald-300 inline-flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2 group-hover:text-emerald-300 transition-colors">
                Atomic stock guard
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Inventory cannot reserve more than is available.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#131b2e]/80 border border-slate-800 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-[#162038] hover:shadow-xl hover:shadow-emerald-500/5 group">
              <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400 group-hover:border-emerald-400/40 group-hover:text-emerald-300 inline-flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2 group-hover:text-emerald-300 transition-colors">
                Razorpay sandbox
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Payment orders and signature verification are wired end to end.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#131b2e]/80 border border-slate-800 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-[#162038] hover:shadow-xl hover:shadow-emerald-500/5 group">
              <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400 group-hover:border-emerald-400/40 group-hover:text-emerald-300 inline-flex items-center justify-center mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2 group-hover:text-emerald-300 transition-colors">
                Integration tests
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Reserve, confirm, cancel, and rollback paths are covered.
              </p>
            </div>
          </div>

          {/* Footer Tech Stack Badges */}
          <div className="pt-8 border-t border-slate-800/80 relative z-10 flex flex-wrap items-center justify-center gap-2.5">
            {["Next.js", "TypeScript", "Node.js", "MongoDB", "Razorpay", "Docker"].map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-slate-900 px-3.5 py-1 text-slate-300 border border-slate-800 text-xs font-mono hover:border-emerald-500/30 hover:text-emerald-300 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — FAQ (#faq) */}
      <section id="faq" className="py-24 lg:py-32 px-4 sm:px-8 max-w-[900px] mx-auto border-t border-[#E6E8E3]">
        <div className="text-center space-y-3 mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#285440] font-sans">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            What happens when stock changes?
          </h2>
        </div>

        {/* Accessible Accordions */}
        <div className="space-y-3 font-sans">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E6E8E3] rounded-[14px] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm text-[#111827]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B7280] transition-transform ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#4B5563] leading-relaxed border-t border-[#F4F5F1] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 9 — FINAL CTA */}
      <section className="py-16 px-4 sm:px-8 max-w-[1240px] mx-auto">
        <div className="p-10 sm:p-14 bg-[#EEF4EF] border border-[#DCEADE] rounded-[20px] text-center space-y-4 shadow-xs">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827]">
            See every inventory decision in context.
          </h2>
          <p className="text-xs sm:text-sm text-[#285440] max-w-md mx-auto leading-relaxed">
            Explore the workspace and follow an order from stock reservation to delivery assignment.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-[10px] bg-[#234A38] text-white font-semibold text-xs hover:bg-[#193A2A] transition-colors shadow-sm inline-flex items-center gap-2"
            >
              Open Stronix workspace <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="text-xs font-semibold text-[#285440] hover:underline py-2"
            >
              Review the order workflow &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#E6E8E3] py-10 px-6 font-sans relative z-20">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#6B7280]">
          <div className="flex items-center gap-2">
            <StronixLogo className="w-4 h-4 text-gray-900" />
            <span className="font-bold text-[#111827]">Stronix</span>
            <span>· Supply chain, made clear.</span>
          </div>

          <div className="flex items-center gap-6 font-medium text-[#374151]">
            <a href="#product" className="hover:text-[#111827] transition-colors">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-[#111827] transition-colors">
              How it works
            </a>
            <a href="#why-stronix" className="hover:text-[#111827] transition-colors">
              Why Stronix
            </a>
            <a href="#faq" className="hover:text-[#111827] transition-colors">
              FAQ
            </a>
            <Link href="/dashboard" className="hover:text-[#111827] transition-colors">
              Open workspace
            </Link>
          </div>

          <div>
            © {new Date().getFullYear()} Stronix. Built as a focused supply-chain foundation.
          </div>
        </div>
      </footer>
    </div>
  );
}
