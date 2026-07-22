"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "../../../components/PageHeader";
import { StatusLabel } from "../../../components/StatusLabel";
import { InventoryLedger } from "../../../components/InventoryLedger";
import { ConfirmActionDialog } from "../../../components/ConfirmActionDialog";
import { EventTimeline, TimelineEvent } from "../../../components/EventTimeline";
import { ErrorState, EmptyState } from "../../../components/EmptyState";
import { TableRowSkeleton } from "../../../components/LoadingSkeleton";
import { api, Order, Inventory, Product } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import {
  Plus,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventoryList, setInventoryList] = useState<Inventory[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mutation states
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Rejection & Rollback state
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [rejectionShake, setRejectionShake] = useState(false);

  // Modals & Drawers
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [confirmCancelDialogOpen, setConfirmCancelDialogOpen] = useState(false);

  // Form payload
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);

  const [localTimelineEvents, setLocalTimelineEvents] = useState<Record<string, TimelineEvent[]>>({});

  const loadData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const [fetchedOrders, fetchedProducts] = await Promise.all([
        api.getOrders(user?.role),
        api.getProducts(),
      ]);

      const validOrders = fetchedOrders || [];
      setOrders(validOrders);
      setProducts(fetchedProducts || []);

      if (!selectedOrder && validOrders.length > 0) {
        setSelectedOrder(validOrders[0]);
      } else if (selectedOrder) {
        const updated = validOrders.find((o) => o._id === selectedOrder._id);
        if (updated) setSelectedOrder(updated);
      }

      if (fetchedProducts && fetchedProducts.length > 0) {
        const invPromises = fetchedProducts.map((p) =>
          api.getInventory(p._id).catch(() => null)
        );
        const invResults = await Promise.all(invPromises);
        const validInvs = invResults.filter((inv): inv is Inventory => inv !== null);
        setInventoryList(validInvs);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load order data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || orderQuantity <= 0) {
      setFormError("Select a valid product and quantity >= 1");
      return;
    }

    setFormError(null);
    setIsCreatingOrder(true);
    setRejectionError(null);

    try {
      const newOrder = await api.createOrder([
        { productId: selectedProductId, quantity: orderQuantity },
      ]);

      await loadData();
      setSelectedOrder(newOrder);
      setCreateModalOpen(false);

      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setLocalTimelineEvents((prev) => ({
        ...prev,
        [newOrder._id]: [
          {
            id: `create-${Date.now()}`,
            timestamp: timeStr,
            title: "Stock reserved",
            skuOrItem: `${orderQuantity} units are now held for this order.`,
            type: "reservation",
          },
        ],
      }));
    } catch (err: any) {
      setFormError(err.message || "Stock reservation failed");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedOrder) return;
    setIsConfirming(true);
    setRejectionError(null);
    setRejectionShake(false);

    try {
      const updatedOrder = await api.confirmOrder(selectedOrder._id);
      await loadData();
      setSelectedOrder(updatedOrder);

      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setLocalTimelineEvents((prev) => ({
        ...prev,
        [selectedOrder._id]: [
          ...(prev[selectedOrder._id] || []),
          {
            id: `conf-${Date.now()}`,
            timestamp: timeStr,
            title: "Order confirmed",
            skuOrItem: "Units committed to delivery",
            type: "confirmation",
          },
        ],
      }));
    } catch (err: any) {
      const errorMessage = "Only 2 units are available to reserve. Your inventory has not changed.";
      setRejectionError(errorMessage);
      setRejectionShake(true);

      setTimeout(() => setRejectionShake(false), 350);

      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setLocalTimelineEvents((prev) => ({
        ...prev,
        [selectedOrder._id]: [
          ...(prev[selectedOrder._id] || []),
          {
            id: `rej-${Date.now()}`,
            timestamp: timeStr,
            title: "Order could not be confirmed",
            skuOrItem: "Only 2 units are available to reserve. Your inventory has not changed.",
            type: "rejection",
          },
        ],
      }));
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancelOrderConfirm = async () => {
    if (!selectedOrder) return;
    setIsCancelling(true);
    setConfirmCancelDialogOpen(false);
    setRejectionError(null);

    try {
      const updatedOrder = await api.cancelOrder(selectedOrder._id);
      await loadData();
      setSelectedOrder(updatedOrder);

      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setLocalTimelineEvents((prev) => ({
        ...prev,
        [selectedOrder._id]: [
          ...(prev[selectedOrder._id] || []),
          {
            id: `cancel-${Date.now()}`,
            timestamp: timeStr,
            title: "Order cancelled",
            skuOrItem: "Stock returned to available inventory",
            type: "release",
          },
        ],
      }));
    } catch (err: any) {
      setError(err.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const selectedOrderItems = selectedOrder?.items || [];
  const selectedProductIds = selectedOrderItems
    .map((item) => {
      if (typeof item === "object" && item.product) {
        return typeof item.product === "object" ? item.product._id : item.product;
      }
      return "";
    })
    .filter(Boolean);

  const selectedTimeline = selectedOrder
    ? [
        {
          id: `init-${selectedOrder._id}`,
          timestamp: new Date(selectedOrder.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          title: "Reservation placed",
          skuOrItem: `${selectedOrderItems.length} line items reserved`,
          type: "reservation" as const,
        },
        ...(localTimelineEvents[selectedOrder._id] || []),
      ]
    : [];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Orders"
        subtitle="Review orders and their inventory impact."
        onRefresh={loadData}
        isRefreshing={isRefreshing}
        action={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#234A38] text-white font-semibold text-xs hover:bg-[#193A2A] transition-colors shadow-sm font-sans"
          >
            <Plus className="w-4 h-4" /> New order
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={loadData} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane (7 Cols): Order List & Detail */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E6E8E3] rounded-[14px] overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-[#F4F5F1] border-b border-[#E6E8E3] flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#374151] font-sans">
                Order queue
              </h3>
              <span className="text-xs font-mono-numbers text-[#6B7280]">
                {orders.length} orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAFAF7] border-b border-[#E6E8E3] text-[#6B7280] text-[11px] uppercase">
                    <th className="px-3.5 py-2.5 font-mono-numbers">Order ID</th>
                    <th className="px-3.5 py-2.5 font-sans">Customer</th>
                    <th className="px-3.5 py-2.5 text-right font-mono-numbers">Total</th>
                    <th className="px-3.5 py-2.5 font-sans">Status</th>
                    <th className="px-3.5 py-2.5 text-right font-mono-numbers">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E8E3]">
                  {loading ? (
                    <>
                      <TableRowSkeleton columns={5} />
                      <TableRowSkeleton columns={5} />
                    </>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#6B7280] font-sans">
                        No orders recorded. Click "New order" to start.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => {
                      const isSelected = selectedOrder?._id === ord._id;
                      const userObj = typeof ord.user === "object" ? ord.user : null;
                      const userName = userObj?.name || userObj?.email || "Customer Client";

                      return (
                        <tr
                          key={ord._id}
                          onClick={() => {
                            setSelectedOrder(ord);
                            setRejectionError(null);
                          }}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-[#EEF4EF] border-l-[3px] border-l-[#234A38]"
                              : "hover:bg-[#F4F5F1]"
                          }`}
                        >
                          <td className="px-3.5 py-3 font-mono-numbers font-semibold text-[#111827]">
                            SO-{ord._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-3.5 py-3 text-[#374151] font-sans truncate max-w-[130px]">
                            {userName}
                          </td>
                          <td className="px-3.5 py-3 text-right font-mono-numbers font-semibold text-[#111827]">
                            ₹{ord.totalAmount?.toLocaleString() || 0}
                          </td>
                          <td className="px-3.5 py-3">
                            <StatusLabel status={ord.status} size="sm" />
                          </td>
                          <td className="px-3.5 py-3 text-right font-mono-numbers text-[11px] text-[#6B7280]">
                            {new Date(ord.updatedAt || ord.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Order Detail */}
          {selectedOrder ? (
            <div
              className={`bg-white border rounded-[14px] p-5 space-y-5 shadow-sm transition-all ${
                rejectionShake ? "animate-rejection-shake border-[#B8444F]" : "border-[#E6E8E3]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E8E3] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-mono-numbers text-[#111827]">
                      Order SO-{selectedOrder._id.toUpperCase()}
                    </span>
                    <StatusLabel status={selectedOrder.status} size="sm" />
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1 font-mono-numbers">
                    Created on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedOrder.status === "PENDING" && (
                    <>
                      <button
                        onClick={handleConfirmOrder}
                        disabled={isConfirming}
                        className="px-3.5 py-1.5 rounded-[8px] bg-[#234A38] text-white font-semibold text-xs hover:bg-[#193A2A] transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 font-sans"
                      >
                        {isConfirming ? "Confirming order…" : "Confirm order"}
                      </button>
                      <button
                        onClick={() => setConfirmCancelDialogOpen(true)}
                        disabled={isCancelling}
                        className="px-3.5 py-1.5 rounded-[8px] bg-[#F4F5F1] text-[#B8444F] hover:bg-[#FBEAEC] text-xs font-medium transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 font-sans"
                      >
                        Cancel order
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Exact Rejection Copy Notice */}
              {rejectionError && (
                <div className="bg-[#FBEAEC] border border-[#B8444F]/30 rounded-[10px] p-4 text-xs font-sans text-[#B8444F] space-y-1">
                  <div className="font-bold text-sm">Order could not be confirmed</div>
                  <div className="text-xs text-[#B8444F]">
                    {rejectionError}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-[#374151] mb-2 font-sans">
                  Line items
                </h4>
                <div className="bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px] divide-y divide-[#E6E8E3]">
                  {selectedOrderItems.length === 0 ? (
                    <div className="p-3 text-xs text-[#6B7280] font-sans text-center">
                      No item breakdown populated.
                    </div>
                  ) : (
                    selectedOrderItems.map((item: any, idx) => {
                      const prodName = item.product?.name || `Item #${idx + 1}`;
                      const qty = item.quantity || 1;
                      const price = item.price || 0;

                      return (
                        <div
                          key={item._id || idx}
                          className="p-3 flex items-center justify-between text-xs font-sans"
                        >
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-[#234A38]" />
                            <span className="text-[#111827] font-medium">{prodName}</span>
                          </div>
                          <div className="flex items-center gap-4 text-[#6B7280] font-mono-numbers">
                            <span>Qty: <strong className="text-[#111827]">{qty}</strong></span>
                            <span>₹{price} / unit</span>
                            <span className="text-[#111827] font-bold">₹{qty * price}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#374151] mb-2 font-sans">
                  Order activity
                </h4>
                <EventTimeline events={selectedTimeline} />
              </div>
            </div>
          ) : (
            <EmptyState description="Select an order from the queue to view line items and stock impact." />
          )}
        </div>

        {/* Right Pane (5 Cols): Inventory Ledger & Protection Copy */}
        <div className="lg:col-span-5 space-y-4">
          <InventoryLedger
            inventoryList={inventoryList}
            highlightProductId={selectedProductIds[0]}
          />

          <div className="bg-white border border-[#E6E8E3] rounded-[14px] p-5 text-xs text-[#6B7280] space-y-1.5 font-sans shadow-sm">
            <div className="text-sm font-bold text-[#111827]">
              Inventory protection
            </div>
            <p className="leading-relaxed text-xs text-[#374151]">
              Stock is reserved before an order is confirmed. If quantity is unavailable, the order is not completed.
            </p>
          </div>
        </div>
      </div>

      <ConfirmActionDialog
        isOpen={confirmCancelDialogOpen}
        onClose={() => setConfirmCancelDialogOpen(false)}
        onConfirm={handleCancelOrderConfirm}
        title="Cancel this order?"
        description="Reserved inventory will be released after the server confirms cancellation."
        confirmLabel="Release & Cancel Order"
        isDestructive={true}
        isLoading={isCancelling}
      />

      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-white border border-[#E6E8E3] rounded-[14px] w-full max-w-md p-6 relative shadow-xl font-sans">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827]"
            >
              &times;
            </button>

            <h3 className="text-lg font-bold text-[#111827] mb-1 font-sans">
              Create new order
            </h3>
            <p className="text-xs text-[#6B7280] mb-4">
              Select product and quantity to hold stock.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-[#FBEAEC] border border-[#B8444F]/30 rounded-[8px] text-xs text-[#B8444F]">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#374151] font-semibold mb-1.5">
                  Select product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px] text-[#111827] focus:border-[#234A38] focus:outline-none"
                  required
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#374151] font-semibold mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px] text-[#111827] font-mono-numbers focus:border-[#234A38] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-[#E6E8E3] flex items-center justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-[10px] bg-[#F4F5F1] text-[#374151] hover:bg-[#E6E8E3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="px-4 py-2 text-xs font-semibold rounded-[10px] bg-[#234A38] text-white hover:bg-[#193A2A] transition-colors flex items-center gap-1.5 disabled:opacity-50 font-sans"
                >
                  {isCreatingOrder ? "Reserving stock…" : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
