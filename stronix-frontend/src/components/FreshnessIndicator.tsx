"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface FreshnessIndicatorProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date;
}

export function FreshnessIndicator({
  onRefresh,
  isRefreshing = false,
  lastUpdated,
}: FreshnessIndicatorProps) {
  const [timeString, setTimeString] = useState<string>("just now");

  useEffect(() => {
    const formatTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `at ${hours}:${minutes}`;
    };

    if (lastUpdated) {
      setTimeString(formatTime(lastUpdated));
    } else {
      setTimeString("just now");
    }
  }, [lastUpdated]);

  return (
    <div className="inline-flex items-center gap-2 text-xs font-sans text-[#6B7280]">
      <span>Updated {timeString}</span>
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh data"
          className="p-1 text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F5F1] rounded-[6px] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#234A38]" : ""}`} />
        </button>
      )}
    </div>
  );
}
