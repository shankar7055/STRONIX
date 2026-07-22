import React from "react";

export type StatusType =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "REJECTED"
  | "ACTIVE"
  | "INACTIVE"
  | "CREATED"
  | "ASSIGNED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED";

interface StatusLabelProps {
  status: StatusType | string;
  size?: "sm" | "md";
}

export function StatusLabel({ status, size = "md" }: StatusLabelProps) {
  const normalized = (status || "").toUpperCase();

  let labelText = "Processing";
  let classes = "bg-[#F4F5F1] text-[#6B7280]";

  switch (normalized) {
    case "PENDING":
    case "IN_TRANSIT":
      labelText = normalized === "PENDING" ? "Awaiting review" : "In transit";
      classes = "bg-[#FCF3D9] text-[#B7791F]";
      break;

    case "CONFIRMED":
    case "DELIVERED":
    case "ASSIGNED":
    case "ACTIVE":
      if (normalized === "CONFIRMED") labelText = "Confirmed";
      else if (normalized === "DELIVERED") labelText = "Delivered";
      else if (normalized === "ASSIGNED") labelText = "Assigned";
      else labelText = "Active";
      classes = "bg-[#EEF4EF] text-[#285440] font-medium";
      break;

    case "CANCELLED":
    case "INACTIVE":
      labelText = normalized === "CANCELLED" ? "Cancelled" : "Inactive";
      classes = "bg-[#F4F5F1] text-[#6B7280]";
      break;

    case "REJECTED":
    case "FAILED":
      labelText = normalized === "REJECTED" ? "Rejected" : "Failed";
      classes = "bg-[#FBEAEC] text-[#B8444F] font-medium";
      break;

    case "CREATED":
      labelText = "Created";
      classes = "bg-[#F4F5F1] text-[#374151]";
      break;
  }

  const padding = size === "sm" ? "px-2 py-0.5 text-[12px]" : "px-2.5 py-1 text-[13px]";

  return (
    <span className={`inline-flex items-center font-sans rounded-[6px] ${padding} ${classes}`}>
      {labelText}
    </span>
  );
}
