"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "../../../components/PageHeader";
import { MetricBlock } from "../../../components/MetricBlock";
import { OperationalTable } from "../../../components/OperationalTable";
import { ErrorState } from "../../../components/EmptyState";
import { TableRowSkeleton } from "../../../components/LoadingSkeleton";
import { api, Inventory, Product } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { Plus } from "lucide-react";

export default function InventoryPage() {
  const { user } = useAuth();
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantityInput, setQuantityInput] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const fetchedProducts = await api.getProducts().catch(() => []);
      setProducts(fetchedProducts || []);

      if (fetchedProducts && fetchedProducts.length > 0) {
        const invPromises = fetchedProducts.map((p) =>
          api.getInventory(p._id).catch(() => null)
        );
        const invResults = await Promise.all(invPromises);
        const validInvs = invResults.filter((inv): inv is Inventory => inv !== null);
        setInventories(validInvs);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load inventory data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || quantityInput <= 0) {
      setFormError("Select a valid product and quantity.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await api.addStock({
        productId: selectedProductId,
        quantity: quantityInput,
      });

      await loadData();
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to add stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAvailable = inventories.reduce((acc, i) => acc + (i.availableQuantity || 0), 0);
  const totalReserved = inventories.reduce((acc, i) => acc + (i.reservedQuantity || 0), 0);

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Inventory"
        subtitle="A clear view of available and reserved stock."
        onRefresh={loadData}
        isRefreshing={isRefreshing}
        action={
          user?.role === "ADMIN" || user?.role === "WAREHOUSE_MANAGER" ? (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#234A38] text-white font-semibold text-xs hover:bg-[#193A2A] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add stock level
            </button>
          ) : undefined
        }
      />

      {error && <ErrorState message={error} onRetry={loadData} />}

      <div className="bg-white border border-[#E6E8E3] rounded-[14px] p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E6E8E3]">
          <MetricBlock
            label="Available units"
            value={totalAvailable}
            subtext="Ready to fulfil new orders"
            accent="forest"
          />
          <MetricBlock
            label="Reserved units"
            value={totalReserved}
            subtext="Held for pending orders"
            accent="amber"
          />
          <MetricBlock
            label="Products tracked"
            value={products.length}
            subtext="Currently in your catalogue"
            accent="ink"
          />
        </div>
      </div>

      <OperationalTable
        headers={["Product / SKU", "Status", "Available Units", "Reserved Units", "Total Stock", "Updated"]}
        isEmpty={inventories.length === 0}
        emptyMessage="No inventory holds registered. Select 'Add stock level' to initialize."
      >
        {loading ? (
          <>
            <TableRowSkeleton columns={6} />
            <TableRowSkeleton columns={6} />
          </>
        ) : (
          inventories.map((inv) => {
            const productObj = typeof inv.product === "object" ? (inv.product as Product) : null;
            const prodId = productObj?._id || (typeof inv.product === "string" ? inv.product : "");
            const name = productObj?.name || `SKU-${prodId.slice(-6).toUpperCase()}`;
            const available = inv.availableQuantity || 0;
            const reserved = inv.reservedQuantity || 0;
            const total = available + reserved;

            return (
              <tr key={inv._id || prodId} className="hover:bg-[#F4F5F1] transition-colors">
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-[#111827]">{name}</div>
                  <div className="text-[11px] font-mono-numbers text-[#6B7280]">
                    SKU-{prodId.slice(-6).toUpperCase()}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 text-xs rounded bg-[#EEF4EF] text-[#285440] font-medium">
                    Active
                  </span>
                </td>
                <td className="px-4 py-3.5 font-mono-numbers text-right font-semibold text-[#234A38]">
                  {available}
                </td>
                <td className="px-4 py-3.5 font-mono-numbers text-right font-semibold text-[#B7791F]">
                  {reserved}
                </td>
                <td className="px-4 py-3.5 font-mono-numbers text-right font-bold text-[#111827]">
                  {total}
                </td>
                <td className="px-4 py-3.5 font-mono-numbers text-xs text-[#6B7280] text-right">
                  {inv.updatedAt
                    ? new Date(inv.updatedAt).toLocaleString([], {
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "just now"}
                </td>
              </tr>
            );
          })
        )}
      </OperationalTable>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-white border border-[#E6E8E3] rounded-[14px] w-full max-w-md p-6 relative shadow-xl font-sans">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827]"
            >
              &times;
            </button>

            <h3 className="text-lg font-bold text-[#111827] mb-1 font-sans">
              Add stock level
            </h3>
            <p className="text-xs text-[#6B7280] mb-4">
              Increase available units for a product.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-[#FBEAEC] border border-[#B8444F]/30 rounded-[8px] text-xs text-[#B8444F]">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddStock} className="space-y-4 text-xs font-sans">
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
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#374151] font-semibold mb-1.5">
                  Units to add
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px] text-[#111827] font-mono-numbers focus:border-[#234A38] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-[#E6E8E3] flex items-center justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-[10px] bg-[#F4F5F1] text-[#374151] hover:bg-[#E6E8E3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold rounded-[10px] bg-[#234A38] text-white hover:bg-[#193A2A] transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
