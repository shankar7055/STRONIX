import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AttentionItemProps {
  count: number;
  zeroText: string;
  activeTextSingular: string;
  activeTextPlural: string;
  href: string;
  actionLabel?: string;
  isAmberNeeded?: boolean;
}

export function AttentionItem({
  count,
  zeroText,
  activeTextSingular,
  activeTextPlural,
  href,
  actionLabel = "Review →",
  isAmberNeeded = false,
}: AttentionItemProps) {
  const isZero = count === 0;

  let displayText = zeroText;
  if (!isZero) {
    displayText = count === 1 ? `${count} ${activeTextSingular}` : `${count} ${activeTextPlural}`;
  }

  return (
    <Link
      href={href}
      className={`group flex items-center justify-between px-4 py-3 rounded-[8px] transition-colors font-sans ${
        !isZero && isAmberNeeded
          ? "bg-[#FCF3D9]/60 hover:bg-[#FCF3D9]"
          : "bg-[#F4F5F1]/60 hover:bg-[#F4F5F1]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-[4px] font-mono-numbers ${
            !isZero && isAmberNeeded
              ? "bg-[#B7791F] text-white"
              : "bg-[#E6E8E3] text-[#374151]"
          }`}
        >
          {String(count).padStart(2, "0")}
        </span>
        <span
          className={`text-xs font-medium ${
            !isZero && isAmberNeeded ? "text-[#111827] font-semibold" : "text-[#374151]"
          }`}
        >
          {displayText}
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs font-medium text-[#234A38] group-hover:underline">
        <span>{actionLabel}</span>
      </div>
    </Link>
  );
}
