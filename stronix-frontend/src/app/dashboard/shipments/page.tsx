"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "../../../components/PageHeader";
import { StatusLabel } from "../../../components/StatusLabel";
import { RankedCandidateList } from "../../../components/RankedCandidateList";
import { ErrorState, EmptyState } from "../../../components/EmptyState";
import { TableRowSkeleton } from "../../../components/LoadingSkeleton";
import {
  api,
  Shipment,
  Distributor,
  Order,
  evaluateDistributorCandidates,
  CandidateScore,
} from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import {
  Truck,
  Plus,
  UserCheck,
  PackageCheck,
  MapPin,
} from "lucide-react";

export default function ShipmentsPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [confirmedOrders, setConfirmedOrders] = useState<Order[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isAssigning, setIsAssigning] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [addressInput, setAddressInput] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const [fetchedShipments, fetchedDistributors, fetchedOrders] = await Promise.all([
        api.getShipments().catch(() => []),
        api.getDistributors().catch(() => []),
        api.getOrders(user?.role).catch(() => []),
      ]);

      const validShipments = fetchedShipments || [];
      setShipments(validShipments);
      setDistributors(fetchedDistributors || []);

      const confirmed = (fetchedOrders || []).filter((o) => o.status === "CONFIRMED");
      setConfirmedOrders(confirmed);

      if (!selectedShipment && validShipments.length > 0) {
        setSelectedShipment(validShipments[0]);
      } else if (selectedShipment) {
        const updated = validShipments.find((s) => s._id === selectedShipment._id);
        if (updated) setSelectedShipment(updated);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load shipment data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !addressInput.trim()) {
      setFormError("Select an order and enter a valid delivery address.");
      return;
    }

    setFormError(null);
    setIsCreating(true);

    try {
      const newShipment = await api.createShipment({
        orderId: selectedOrderId,
        address: addressInput,
      });

      await loadData();
      setSelectedShipment(newShipment);
      setCreateModalOpen(false);
      setAddressInput("");
      setSelectedOrderId("");
    } catch (err: any) {
      setFormError(err.message || "Failed to create shipment");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAutoAssign = async () => {
    if (!selectedShipment) return;
    setIsAssigning(true);
    setError(null);

    try {
      const result = await api.assignDistributor(selectedShipment._id);
      await loadData();
      if (result.shipment) {
        setSelectedShipment(result.shipment);
      }
    } catch (err: any) {
      setError(err.message || "No distributor available for auto-assignment");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedShipment) return;
    try {
      const result = await api.updateShipmentStatus(selectedShipment._id, status);
      await loadData();
      if (result.shipment) {
        setSelectedShipment(result.shipment);
      }
    } catch (err: any) {
      setError(err.message || `Failed to update status to ${status}`);
    }
  };

  const assignedDistributorId =
    typeof selectedShipment?.distributor === "object"
      ? selectedShipment.distributor?._id
      : selectedShipment?.distributor;

  const candidateScores: CandidateScore[] = selectedShipment
    ? evaluateDistributorCandidates(
        selectedShipment.address,
        distributors,
        assignedDistributorId
      )
    : [];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Shipments"
        subtitle="Coordinate delivery from order confirmation to handoff."
        onRefresh={loadData}
        isRefreshing={isRefreshing}
        action={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#234A38] text-white font-semibold text-xs hover:bg-[#193A2A] transition-colors shadow-sm font-sans"
          >
            <Plus className="w-4 h-4" /> New shipment
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={loadData} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Shipment Queue */}
        <div className="lg:col-span-7 bg-white border border-[#E6E8E3] rounded-[14px] overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-[#F4F5F1] border-b border-[#E6E8E3] flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#374151] font-sans">
              Shipment queue
            </h3>
            <span className="text-xs font-mono-numbers text-[#6B7280]">
              {shipments.length} shipments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-[#FAFAF7] border-b border-[#E6E8E3] text-[#6B7280] text-[11px] uppercase">
                  <th className="px-3.5 py-2.5 font-mono-numbers">Shipment ID</th>
                  <th className="px-3.5 py-2.5">Destination</th>
                  <th className="px-3.5 py-2.5">Assignment</th>
                  <th className="px-3.5 py-2.5">Status</th>
                  <th className="px-3.5 py-2.5 text-right font-mono-numbers">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8E3]">
                {loading ? (
                  <>
                    <TableRowSkeleton columns={5} />
                    <TableRowSkeleton columns={5} />
                  </>
                ) : shipments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#6B7280] font-sans">
                      <div className="font-bold text-sm text-[#111827] mb-1">No shipments yet</div>
                      <div>Create a shipment from a confirmed order to begin tracking delivery.</div>
                    </td>
                  </tr>
                ) : (
                  shipments.map((ship) => {
                    const isSelected = selectedShipment?._id === ship._id;
                    const distObj = typeof ship.distributor === "object" ? ship.distributor : null;
                    const distName = distObj?.name || (ship.distributor ? "Assigned" : "Unassigned");

                    return (
                      <tr
                        key={ship._id}
                        onClick={() => setSelectedShipment(ship)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#EEF4EF] border-l-[3px] border-l-[#234A38]"
                            : "hover:bg-[#F4F5F1]"
                        }`}
                      >
                        <td className="px-3.5 py-3 font-mono-numbers font-semibold text-[#111827]">
                          SH-{ship._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-3.5 py-3 text-[#374151] truncate max-w-[150px]">
                          {ship.address}
                        </td>
                        <td className="px-3.5 py-3 text-xs">
                          {ship.distributor ? (
                            <span className="text-[#234A38] font-medium">{distName}</span>
                          ) : (
                            <span className="text-[#B7791F]">Awaiting Assignment</span>
                          )}
                        </td>
                        <td className="px-3.5 py-3">
                          <StatusLabel status={ship.status} size="sm" />
                        </td>
                        <td className="px-3.5 py-3 text-right font-mono-numbers text-[11px] text-[#6B7280]">
                          {new Date(ship.updatedAt || ship.createdAt).toLocaleTimeString([], {
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

        {/* Right Pane: Selected Shipment Details & Rationale Workspace */}
        <div className="lg:col-span-5 space-y-4">
          {selectedShipment ? (
            <div className="bg-white border border-[#E6E8E3] rounded-[14px] p-5 space-y-5 shadow-sm font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E8E3] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-mono-numbers text-[#111827]">
                      SH-{selectedShipment._id.toUpperCase()}
                    </span>
                    <StatusLabel status={selectedShipment.status} size="sm" />
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#234A38]" />
                    <span>{selectedShipment.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!selectedShipment.distributor && (
                    <button
                      onClick={handleAutoAssign}
                      disabled={isAssigning}
                      className="px-3.5 py-1.5 rounded-[8px] bg-[#234A38] text-white font-semibold text-xs hover:bg-[#193A2A] transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 font-sans"
                    >
                      {isAssigning ? "Evaluating…" : "Assign distributor"}
                    </button>
                  )}

                  {selectedShipment.distributor && selectedShipment.status === "ASSIGNED" && (
                    <button
                      onClick={() => handleUpdateStatus("IN_TRANSIT")}
                      className="px-3.5 py-1.5 rounded-[8px] bg-[#234A38] text-white font-semibold text-xs hover:bg-[#193A2A] transition-colors inline-flex items-center gap-1.5 font-sans"
                    >
                      <Truck className="w-3.5 h-3.5" /> Mark in transit
                    </button>
                  )}

                  {selectedShipment.status === "IN_TRANSIT" && (
                    <button
                      onClick={() => handleUpdateStatus("DELIVERED")}
                      className="px-3.5 py-1.5 rounded-[8px] bg-[#234A38] text-white font-semibold text-xs hover:bg-[#193A2A] transition-colors inline-flex items-center gap-1.5 font-sans"
                    >
                      <PackageCheck className="w-3.5 h-3.5" /> Confirm delivery
                    </button>
                  )}
                </div>
              </div>

              <RankedCandidateList
                candidates={candidateScores}
              />

              <div>
                <h4 className="text-xs font-bold text-[#374151] mb-2 font-sans">
                  Tracking history
                </h4>
                <div className="bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px] p-3 space-y-2 text-xs font-sans">
                  {selectedShipment.tracking && selectedShipment.tracking.length > 0 ? (
                    selectedShipment.tracking.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[12px]">
                        <span className="text-[#111827] font-medium">{t.status}</span>
                        <span className="text-[#6B7280] font-mono-numbers">
                          {new Date(t.timestamp).toLocaleString([], {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[#6B7280] text-center font-sans">No tracking logs recorded yet.</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState description="Select a shipment from the queue to review distributor candidate ranking." />
          )}
        </div>
      </div>

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
              Create new shipment
            </h3>
            <p className="text-xs text-[#6B7280] mb-4">
              Select a confirmed order and enter delivery address.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-[#FBEAEC] border border-[#B8444F]/30 rounded-[8px] text-xs text-[#B8444F]">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateShipment} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#374151] font-semibold mb-1.5">
                  Confirmed order
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px] text-[#111827] focus:border-[#234A38] focus:outline-none"
                  required
                >
                  <option value="">-- Select Confirmed Order --</option>
                  {confirmedOrders.map((o) => (
                    <option key={o._id} value={o._id}>
                      SO-{o._id.slice(-6).toUpperCase()} (₹{o.totalAmount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#374151] font-semibold mb-1.5">
                  Delivery address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru South, Sector 4"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAFAF7] border border-[#E6E8E3] rounded-[10px] text-[#111827] focus:border-[#234A38] focus:outline-none"
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
                  disabled={isCreating}
                  className="px-4 py-2 text-xs font-semibold rounded-[10px] bg-[#234A38] text-white hover:bg-[#193A2A] transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isCreating ? "Creating…" : "Create Shipment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
