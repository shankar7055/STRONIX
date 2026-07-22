import React from "react";

interface MetricBlockProps {
  label: string;
  value: string | number;
  subtext?: string;
  accent?: "amber" | "forest" | "ink" | "danger";
}

export function MetricBlock({
  label,
  value,
  subtext,
  accent = "ink",
}: MetricBlockProps) {
  let valueColor = "text-[#111827]";

  if (accent === "amber") {
    valueColor = "text-[#B7791F]";
  } else if (accent === "forest") {
    valueColor = "text-[#234A38]";
  } else if (accent === "danger") {
    valueColor = "text-[#B8444F]";
  }

  return (
    <div className="flex flex-col justify-between py-2 px-4 font-sans">
      <div className="text-xs font-semibold text-[#6B7280]">
        {label}
      </div>

      <div className={`text-3xl sm:text-4xl font-bold font-mono-numbers tracking-tight my-1 ${valueColor}`}>
        {value}
      </div>

      {subtext && (
        <div className="text-xs text-[#98A1AC]">
          {subtext}
        </div>
      )}
    </div>
  );
}
