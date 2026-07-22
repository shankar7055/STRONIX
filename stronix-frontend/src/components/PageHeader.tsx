import React from "react";
import { FreshnessIndicator } from "./FreshnessIndicator";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  onRefresh,
  isRefreshing = false,
  lastUpdated,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] font-sans">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[#6B7280] font-sans font-normal mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {onRefresh && (
          <FreshnessIndicator onRefresh={onRefresh} isRefreshing={isRefreshing} lastUpdated={lastUpdated} />
        )}
        {action}
      </div>
    </div>
  );
}
