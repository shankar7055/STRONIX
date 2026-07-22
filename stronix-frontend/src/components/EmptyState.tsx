import React from "react";
import { Inbox, AlertCircle, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No data found",
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-[#0B1726] border border-[#1A2C3E] rounded-[8px] p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
      <div className="p-3 bg-[#101F32] rounded-full border border-[#1A2C3E] text-[#6F8497] mb-3">
        <Inbox className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-[#EDF4F8] mb-1">{title}</h4>
      <p className="text-xs text-[#6F8497] max-w-sm font-mono mb-4">{description}</p>
      {action}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "System Alert",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="bg-[#301C28]/40 border border-[#E3646D]/40 rounded-[8px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-[#E3646D] shrink-0" />
        <div>
          <h5 className="font-semibold text-[#E3646D]">{title}</h5>
          <p className="text-[#A7B7C6] font-mono mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#101F32] border border-[#29445D] text-[#EDF4F8] hover:bg-[#142B40] hover:border-[#F4B65C] transition-colors shrink-0 font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}
