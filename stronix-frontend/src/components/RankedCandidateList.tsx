import React from "react";
import { CandidateScore } from "../lib/api";
import { CheckCircle2 } from "lucide-react";

interface RankedCandidateListProps {
  candidates: CandidateScore[];
  isMocked?: boolean;
}

export function RankedCandidateList({
  candidates,
}: RankedCandidateListProps) {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="bg-white border border-[#E6E8E3] rounded-[14px] p-6 text-center text-xs text-[#6B7280] font-sans">
        No candidate distributors evaluated yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E6E8E3] rounded-[14px] p-5 space-y-3 font-sans shadow-sm">
      <div className="border-b border-[#E6E8E3] pb-3">
        <h4 className="text-sm font-bold text-[#111827]">
          Recommended distributor
        </h4>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Selected for service coverage, current capacity, and delivery rating.
        </p>
      </div>

      <div className="space-y-2">
        {candidates.map((cand) => {
          const { distributor, rank, isEligible, isSelected, compositeScore, explanation } = cand;

          return (
            <div
              key={distributor._id}
              className={`p-3.5 rounded-[10px] border transition-colors text-xs ${
                isSelected
                  ? "bg-[#EEF4EF] border-[#234A38]/30 border-l-[3px] border-l-[#234A38]"
                  : isEligible
                  ? "bg-[#FAFAF7] border-[#E6E8E3]"
                  : "bg-[#F4F5F1]/50 border-[#E6E8E3] opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`font-mono-numbers font-semibold text-xs px-2 py-0.5 rounded ${
                      isSelected
                        ? "bg-[#234A38] text-white"
                        : isEligible
                        ? "bg-[#E6E8E3] text-[#374151]"
                        : "bg-[#FBEAEC] text-[#B8444F]"
                    }`}
                  >
                    {isEligible ? `#${rank}` : "Ineligible"}
                  </span>
                  <span className="font-semibold text-[#111827]">
                    {distributor.name}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-[#234A38] text-white px-2 py-0.5 rounded font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>

                <div className="font-mono-numbers text-xs">
                  {isEligible ? (
                    <span className="text-[#234A38] font-bold">
                      {compositeScore} <span className="text-[11px] text-[#6B7280] font-normal">score</span>
                    </span>
                  ) : (
                    <span className="text-[#B8444F]">Ineligible</span>
                  )}
                </div>
              </div>

              <div className="text-xs text-[#6B7280] mt-1.5 font-sans">
                {explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
