"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { MetricBlock } from "../../components/MetricBlock";
import { AttentionItem } from "../../components/AttentionItem";
import { EventTimeline, TimelineEvent } from "../../components/EventTimeline";
import { OperationalTable } from "../../components/OperationalTable";
import { StatusLabel } from "../../components/StatusLabel";
import { ErrorState } from "../../components/EmptyState";
import { MetricSkeleton } from "../../components/LoadingSkeleton";
import { api, Order, Inventory, Shipment, Product } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OverviewPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const [fetchedOrders, fetchedProducts, fetchedShipments] = await Promise.all([
        api.getOrders(user?.role).catch(() => []),
        api.getProducts().catch(() => []),
        api.getShipments().catch(() => []),
      ]);

      setOrders(fetchedOrders || []);
      setProducts(fetchedProducts || []);
      setShipments(fetchedShipments || []);

      if (fetchedProducts && fetchedProducts.length > 0) {
        const invPromises = fetchedProducts.slice(0, 8).map((p) =>
          api.getInventory(p._id).catch(() => null)
        );
        const invResults = await Promise.all(invPromises);
        const validInvs = invResults.filter((inv): inv is Inventory => inv !== null);
        setInventories(validInvs);
      }

      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "Failed to load overview data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const unassignedShipments = shipments.filter((s) => s.status === "CREATED");
  const lowStockSkus = inventories.filter((inv) => (inv.availableQuantity || 0) <= 2);

  const totalAvailableStock = inventories.reduce((acc, inv) => acc + (inv.availableQuantity || 0), 0);
  const totalReservedUnits = inventories.reduce((acc, inv) => acc + (inv.reservedQuantity || 0), 0);
  const activeReservationsCount = inventories.filter((inv) => (inv.reservedQuantity || 0) > 0).length;

  const timelineEvents: TimelineEvent[] = [];
  orders.slice(0, 5).forEach((order) => {
    const timeStr = new Date(order.updatedAt || order.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (order.status === "PENDING") {
      timelineEvents.push({
        id: `res-${order._id}`,
        timestamp: timeStr,
        title: `Reservation placed for SO-${order._id.slice(-6).toUpperCase()}`,
        skuOrItem: `${order.items?.length || 1} units held`,
        type: "reservation",
      });
    } else if (order.status === "CONFIRMED") {
      timelineEvents.push({
        id: `conf-${order._id}`,
        timestamp: timeStr,
        title: `Order SO-${order._id.slice(-6).toUpperCase()} confirmed`,
        skuOrItem: "Units committed to delivery",
        type: "confirmation",
      });
    } else if (order.status === "CANCELLED") {
      timelineEvents.push({
        id: `rel-${order._id}`,
        timestamp: timeStr,
        title: `Reservation released for SO-${order._id.slice(-6).toUpperCase()}`,
        skuOrItem: "Stock returned to inventory",
        type: "release",
      });
    }
  });

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Overview"
        subtitle="A clear view of orders, stock, and deliveries."
        onRefresh={loadData}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      {error && <ErrorState message={error} onRetry={loadData} />}

      {/* Needs Attention Panel */}
      <div className="bg-white border border-[#E6E8E3] rounded-[14px] p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          Needs attention
        </h3>
        <div className="space-y-2">
          <AttentionItem
            count={pendingOrders.length}
            zeroText="No orders await confirmation"
            activeTextSingular="order awaits confirmation"
            activeTextPlural="orders await confirmation"
            href="/dashboard/orders"
            actionLabel="Review orders →"
            isAmberNeeded={true}
          />
          <AttentionItem
            count={unassignedShipments.length}
            zeroText="No shipments await assignment"
            activeTextSingular="shipment awaits assignment"
            activeTextPlural="shipments await assignment"
            href="/dashboard/shipments"
            actionLabel="View shipments →"
            isAmberNeeded={true}
          />
          <AttentionItem
            count={lowStockSkus.length}
            zeroText="No inventory alerts"
            activeTextSingular="product low on stock"
            activeTextPlural="products low on stock"
            href="/dashboard/inventory"
            actionLabel="View inventory →"
            isAmberNeeded={false}
          />
        </div>
      </div>

      {/* Two Primary Panels: Inventory Snapshot vs Recent Order Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inventory Snapshot (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E6E8E3] rounded-[14px] p-6 flex flex-col justify-between shadow-sm space-y-6">
          <div>
            <div className="border-b border-[#E6E8E3] pb-3 mb-4">
              <h3 className="text-lg font-bold text-[#111827]">
                Inventory snapshot
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Available stock and active reservations.
              </p>
            </div>

            {/* Horizontally aligned values without heavy cards */}
            <div className="grid grid-cols-3 divide-x divide-[#E6E8E3] bg-[#FAFAF7] rounded-[10px] py-2 mb-6">
              {loading ? (
                <>
                  <MetricSkeleton />
                  <MetricSkeleton />
                  <MetricSkeleton />
                </>
              ) : (
                <>
                  <MetricBlock
                    label="Available units"
                    value={totalAvailableStock}
                    subtext="Ready to fulfil new orders"
                    accent="forest"
                  />
                  <MetricBlock
                    label="Reserved units"
                    value={totalReservedUnits}
                    subtext="Held for pending orders"
                    accent="amber"
                  />
                  <MetricBlock
                    label="Active reservations"
                    value={activeReservationsCount}
                    subtext="Open now"
                    accent="ink"
                  />
                </>
              )}
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-xs font-bold text-[#374151] mb-2">
                Recent stock activity
              </h4>
              <EventTimeline events={timelineEvents} />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E6E8E3] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Inventory protection active</span>
            <Link
              href="/dashboard/inventory"
              className="text-[#234A38] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Open inventory ledger &rarr;
            </Link>
          </div>
        </div>

        {/* Recent Order Activity (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E6E8E3] rounded-[14px] p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="border-b border-[#E6E8E3] pb-3 mb-4">
              <h3 className="text-lg font-bold text-[#111827]">
                Recent order activity
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Latest orders in processing
              </p>
            </div>

            <div className="divide-y divide-[#E6E8E3]">
              {orders.slice(0, 6).map((ord) => {
                return (
                  <div
                    key={ord._id}
                    className="py-3 flex items-center justify-between transition-colors hover:bg-[#FAFAF7] px-2 rounded-[6px]"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-xs text-[#111827] font-mono-numbers">
                        SO-{ord._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-[12px] text-[#6B7280] font-mono-numbers">
                        ₹{ord.totalAmount?.toLocaleString() || 0}
                      </span>
                    </div>

                    <StatusLabel status={ord.status} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6E8E3] mt-4 flex items-center justify-between text-xs">
            <span className="text-[#6B7280]">Real-time queue</span>
            <Link
              href="/dashboard/orders"
              className="text-[#234A38] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Go to orders &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Simple Recent Orders Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-[#111827]">
            Recent orders
          </h3>
          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-[#234A38] hover:underline"
          >
            View all orders &rarr;
          </Link>
        </div>

        <OperationalTable
          headers={["Order ID", "Customer", "Total Amount", "Status", "Updated"]}
          isEmpty={orders.length === 0}
          emptyMessage="No orders recorded yet."
        >
          {orders.slice(0, 6).map((ord) => {
            const userObj = typeof ord.user === "object" ? ord.user : null;
            const userName = userObj?.name || userObj?.email || "Customer Client";

            return (
              <tr key={ord._id} className="hover:bg-[#F4F5F1] transition-colors">
                <td className="px-4 py-3.5 font-mono-numbers font-semibold text-[#111827]">
                  SO-{ord._id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3.5 text-[#374151]">{userName}</td>
                <td className="px-4 py-3.5 font-mono-numbers text-right font-semibold text-[#111827]">
                  ₹{ord.totalAmount?.toLocaleString() || 0}
                </td>
                <td className="px-4 py-3.5">
                  <StatusLabel status={ord.status} size="sm" />
                </td>
                <td className="px-4 py-3.5 font-mono-numbers text-right text-xs text-[#6B7280]">
                  {new Date(ord.updatedAt || ord.createdAt).toLocaleString([], {
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            );
          })}
        </OperationalTable>
      </div>
    </div>
  );
}
