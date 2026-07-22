import React from "react";
import { Inventory, Product } from "../lib/api";

interface InventoryLedgerProps {
  inventoryList: Inventory[];
  highlightProductId?: string;
}

export function InventoryLedger({
  inventoryList,
  highlightProductId,
}: InventoryLedgerProps) {
  if (!inventoryList || inventoryList.length === 0) {
    return (
      <div className="bg-white border border-[#E6E8E3] rounded-[14px] p-6 text-center text-xs text-[#6B7280] font-sans">
        No stock items listed.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E6E8E3] rounded-[14px] overflow-hidden shadow-sm font-sans">
      <div className="px-4 py-3 bg-[#F4F5F1] border-b border-[#E6E8E3] flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#374151] font-sans">
          Inventory for this order
        </h3>
        <span className="text-xs text-[#6B7280] font-mono-numbers">
          {inventoryList.length} products
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="bg-[#FAFAF7] border-b border-[#E6E8E3] text-[#6B7280] text-[11px] uppercase">
              <th className="px-4 py-2.5">Product</th>
              <th className="px-4 py-2.5 text-right font-mono-numbers">Available</th>
              <th className="px-4 py-2.5 text-right font-mono-numbers">Reserved</th>
              <th className="px-4 py-2.5 text-right font-mono-numbers">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E8E3]">
            {inventoryList.map((inv) => {
              const productObj = typeof inv.product === "object" ? (inv.product as Product) : null;
              const prodId = productObj?._id || (typeof inv.product === "string" ? inv.product : "");
              const name = productObj?.name || `SKU-${prodId.slice(-6).toUpperCase()}`;

              const isHighlighted = highlightProductId === prodId;
              const available = inv.availableQuantity ?? 0;
              const reserved = inv.reservedQuantity ?? 0;

              return (
                <tr
                  key={inv._id || prodId}
                  className={`transition-colors ${
                    isHighlighted ? "bg-[#EEF4EF] border-l-[3px] border-l-[#234A38]" : "hover:bg-[#F4F5F1]"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#111827]">{name}</div>
                    <div className="text-[11px] text-[#6B7280] font-mono-numbers">
                      SKU-{prodId.slice(-6).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono-numbers text-[#234A38] font-semibold text-sm">
                    {available}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-numbers text-[#B7791F]">
                    {reserved > 0 ? `${reserved} held` : "0"}
                  </td>
                  <td className="px-4 py-3 text-right text-[11px] text-[#6B7280] font-mono-numbers">
                    {inv.updatedAt
                      ? new Date(inv.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "just now"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
