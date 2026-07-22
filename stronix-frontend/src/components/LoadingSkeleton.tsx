import React from "react";

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse border-b border-[#1A2C3E]">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="px-4 py-3.5">
          <div className="h-3.5 bg-[#101F32] rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function MetricSkeleton() {
  return (
    <div className="bg-[#0B1726] border border-[#1A2C3E] rounded-[8px] p-4 animate-pulse">
      <div className="h-3 bg-[#101F32] rounded w-1/2 mb-3" />
      <div className="h-7 bg-[#101F32] rounded w-1/3" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="bg-[#0B1726] border border-[#1A2C3E] rounded-[8px] p-6 space-y-4 animate-pulse">
      <div className="h-5 bg-[#101F32] rounded w-1/3" />
      <div className="h-4 bg-[#101F32] rounded w-2/3" />
      <div className="h-24 bg-[#101F32] rounded w-full mt-4" />
    </div>
  );
}
