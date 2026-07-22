import React from "react";

interface OperationalTableProps {
  headers: string[];
  children: React.ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export function OperationalTable({
  headers,
  children,
  emptyMessage = "No items recorded.",
  isEmpty = false,
}: OperationalTableProps) {
  return (
    <div className="w-full bg-white border border-[#E6E8E3] rounded-[14px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-[#F4F5F1] border-b border-[#E6E8E3] text-[#6B7280] font-medium text-xs">
              {headers.map((head, idx) => (
                <th key={idx} className="px-4 py-3 font-sans">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E8E3]">
            {isEmpty ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-12 text-center text-[#6B7280]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
