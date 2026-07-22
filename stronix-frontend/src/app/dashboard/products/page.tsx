"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "../../../components/PageHeader";
import { OperationalTable } from "../../../components/OperationalTable";
import { ErrorState } from "../../../components/EmptyState";
import { TableRowSkeleton } from "../../../components/LoadingSkeleton";
import { api, Product } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { Plus } from "lucide-react";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [priceInput, setPriceInput] = useState<number>(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const fetched = await api.getProducts();
      setProducts(fetched || []);
    } catch (err: any) {
      setError(err.message || "Failed to load product catalog");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || priceInput <= 0) {
      setFormError("Enter a valid name and price.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await api.createProduct({
        name: nameInput,
        price: priceInput,
      });

      await loadData();
      setModalOpen(false);
      setNameInput("");
      setPriceInput(100);
    } catch (err: any) {
      setFormError(err.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Products"
        subtitle="Catalogue items available for order reservations."
        onRefresh={loadData}
        isRefreshing={isRefreshing}
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#234A38] text-white font-semibold text-xs hover:bg-[#193A2A] transition-colors shadow-sm font-sans"
          >
            <Plus className="w-4 h-4" /> New product
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={loadData} />}

      <OperationalTable
        headers={["Product SKU", "Product Name", "Price (₹)", "Status", "Created"]}
        isEmpty={products.length === 0}
        emptyMessage="No products cataloged. Click 'New product' to register items."
      >
        {loading ? (
          <>
            <TableRowSkeleton columns={5} />
            <TableRowSkeleton columns={5} />
          </>
        ) : (
          products.map((p) => (
            <tr key={p._id} className="hover:bg-[#F4F5F1] transition-colors">
              <td className="px-4 py-3.5 font-mono-numbers font-semibold text-[#111827]">
                SKU-{p._id.slice(-6).toUpperCase()}
              </td>
              <td className="px-4 py-3.5 text-[#111827] font-medium">{p.name}</td>
              <td className="px-4 py-3.5 font-mono-numbers text-right font-semibold text-[#234A38]">
                ₹{p.price?.toLocaleString()}
              </td>
              <td className="px-4 py-3.5">
                <span className="px-2 py-0.5 text-xs rounded bg-[#EEF4EF] text-[#285440] font-medium">
                  {p.status || "Active"}
                </span>
              </td>
              <td className="px-4 py-3.5 font-mono-numbers text-xs text-[#6B7280] text-right">
                {p.createdAt
                  ? new Date(p.createdAt).toLocaleDateString([], {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })
                  : "N/A"}
              </td>
            </tr>
          ))
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
              New product
            </h3>
            <p className="text-xs text-[#6B7280] mb-4 font-sans">
              Add a product to your catalogue.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-[#FBEAEC] border border-[#B8444F]/30 rounded-[8px] text-xs text-[#B8444F]">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#374151] font-semibold mb-1.5">
                  Product name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Industrial Control Unit X10"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px] text-[#111827] focus:border-[#234A38] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#374151] font-semibold mb-1.5">
                  Price per unit (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={priceInput}
                  onChange={(e) => setPriceInput(parseFloat(e.target.value) || 0)}
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
                  {isSubmitting ? "Creating..." : "Save product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
