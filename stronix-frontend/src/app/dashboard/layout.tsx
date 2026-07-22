"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "../../lib/auth-context";
import {
  LayoutDashboard,
  ReceiptText,
  Truck,
  Boxes,
  PackageSearch,
  ScrollText,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export function StronixLogo({ className = "w-5 h-5 text-[#111827]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M 144 256 L 27.598 256 L 144 139.598 Z M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z M 0 204.402 L 0 112 L 92.402 112 Z" />
    </svg>
  );
}

const NAV_SECTIONS = [
  {
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Orders", href: "/dashboard/orders", icon: ReceiptText },
      { name: "Shipments", href: "/dashboard/shipments", icon: Truck },
    ],
  },
  {
    items: [
      { name: "Inventory", href: "/dashboard/inventory", icon: Boxes },
      { name: "Products", href: "/dashboard/products", icon: PackageSearch },
    ],
  },
  {
    items: [
      { name: "Activity", href: "/dashboard/audit", icon: ScrollText },
    ],
  },
];

function DashboardShellContent({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center font-sans text-xs text-[#6B7280]">
        Loading Stronix Operations...
      </div>
    );
  }

  if (!user) return null;

  const roleTitle = user.role === "ADMIN" ? "Administrator" : user.role === "CUSTOMER" ? "Client Operator" : "Operator";

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex text-[#111827] font-sans">
      {/* Sidebar - Fixed 248px Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[248px] bg-white border-r border-[#E6E8E3] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-[64px] px-5 flex items-center justify-between border-b border-[#E6E8E3]">
            <Link href="/" className="flex items-center gap-2.5 group">
              <StronixLogo className="w-5 h-5 text-[#111827] shrink-0" />
              <div>
                <span className="font-bold tracking-tight text-base font-sans text-[#111827] block leading-none">
                  Stronix
                </span>
                <span className="text-xs text-[#6B7280] font-sans block mt-0.5">
                  Supply chain, made clear.
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-[#6B7280] hover:text-[#111827]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-5">
            {NAV_SECTIONS.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {sec.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[8px] text-xs font-sans font-medium transition-colors ${
                        isActive
                          ? "bg-[#EEF4EF] text-[#234A38] font-semibold"
                          : "text-[#374151] hover:bg-[#F4F5F1]"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? "text-[#234A38]" : "text-[#6B7280]"
                        }`}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* User Footer Card */}
        <div className="p-3 border-t border-[#E6E8E3] bg-[#FAFAF7]">
          <div className="flex items-center justify-between px-2 py-1.5 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#EEF4EF] border border-[#DCEADE] flex items-center justify-center text-[#234A38] font-bold text-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[#111827] truncate text-xs">
                  {user.name}
                </div>
                <div className="text-[11px] text-[#6B7280] truncate">
                  {roleTitle}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-[#6B7280] hover:text-[#B8444F] hover:bg-[#FBEAEC] rounded-[6px] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[248px] flex flex-col min-w-0">
        {/* Minimal Top Header */}
        <header className="h-[64px] bg-white/80 backdrop-blur-sm border-b border-[#E6E8E3] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 text-[#6B7280] hover:text-[#111827]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs text-[#6B7280]">Stronix Operations</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#6B7280]">
            <span>{user.email}</span>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShellContent>{children}</DashboardShellContent>
    </AuthProvider>
  );
}
