"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "../../../components/PageHeader";
import { OperationalTable } from "../../../components/OperationalTable";
import { ErrorState } from "../../../components/EmptyState";
import { TableRowSkeleton } from "../../../components/LoadingSkeleton";
import { api, AuditLogItem } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";

export default function ActivityPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const report = await api.getSupplierReport().catch(() => []);
      if (Array.isArray(report)) {
        const formattedLogs: AuditLogItem[] = report.map((item: any, idx: number) => ({
          _id: item._id || `log-${idx}`,
          user: user?._id || "System Operator",
          action: item.action || "SUPPLIER_PURCHASE_SUMMARY",
          entity: item.entity || "PurchaseOrder",
          entityId: item._id || `po-${idx}`,
          createdAt: item.createdAt || new Date().toISOString(),
        }));
        setLogs(formattedLogs);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load activity log");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Activity"
        subtitle="A chronological record of important system events."
        onRefresh={loadData}
        isRefreshing={isRefreshing}
      />

      {error && <ErrorState message={error} onRetry={loadData} />}

      <OperationalTable
        headers={["Event ID", "Action", "Target Entity", "Entity ID", "Timestamp"]}
        isEmpty={logs.length === 0}
        emptyMessage="No historical activity logged."
      >
        {loading ? (
          <>
            <TableRowSkeleton columns={5} />
            <TableRowSkeleton columns={5} />
          </>
        ) : (
          logs.map((log) => (
            <tr key={log._id} className="hover:bg-[#F4F5F1] transition-colors">
              <td className="px-4 py-3.5 font-mono-numbers font-semibold text-[#111827]">
                EVT-{String(log._id).slice(-6).toUpperCase()}
              </td>
              <td className="px-4 py-3.5 font-medium text-[#234A38]">
                {log.action}
              </td>
              <td className="px-4 py-3.5 text-[#374151] font-sans">{log.entity}</td>
              <td className="px-4 py-3.5 text-[#111827] font-mono-numbers">{log.entityId}</td>
              <td className="px-4 py-3.5 font-mono-numbers text-xs text-[#6B7280] text-right">
                {new Date(log.createdAt).toLocaleString([], {
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))
        )}
      </OperationalTable>
    </div>
  );
}
