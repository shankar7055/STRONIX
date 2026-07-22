"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmActionDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm Action",
  isDestructive = false,
  isLoading = false,
}: ConfirmActionDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="bg-[#0B1726] border border-[#29445D] rounded-[10px] w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6F8497] hover:text-[#EDF4F8] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`p-2.5 rounded-[8px] border shrink-0 ${
              isDestructive
                ? "bg-[#301C28] border-[#E3646D]/40 text-[#E3646D]"
                : "bg-[#101F32] border-[#F4B65C]/40 text-[#FFD18B]"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#EDF4F8]">{title}</h3>
            <p className="text-xs text-[#A7B7C6] font-mono leading-relaxed mt-1">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#1A2C3E]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-medium rounded-[6px] bg-[#101F32] border border-[#1A2C3E] text-[#A7B7C6] hover:bg-[#142B40] hover:text-[#EDF4F8] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-semibold rounded-[6px] transition-colors flex items-center gap-2 ${
              isDestructive
                ? "bg-[#E3646D] text-white hover:bg-[#E3646D]/90"
                : "bg-[#F4B65C] text-[#07111E] hover:bg-[#FFD18B]"
            }`}
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
