import React from "react";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  skuOrItem?: string;
  deltaText?: string;
  type: "reservation" | "confirmation" | "release" | "rejection" | "generic";
}

interface EventTimelineProps {
  events: TimelineEvent[];
}

export function EventTimeline({ events }: EventTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-[#6B7280] font-sans">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#E6E8E3] font-sans">
      {events.map((evt) => {
        let titleColor = "text-[#111827]";
        if (evt.type === "confirmation") titleColor = "text-[#234A38]";
        if (evt.type === "reservation") titleColor = "text-[#B7791F]";
        if (evt.type === "rejection") titleColor = "text-[#B8444F]";

        return (
          <div key={evt.id} className="py-3 flex items-start justify-between text-xs">
            <div className="flex flex-col gap-0.5">
              <span className={`font-semibold ${titleColor}`}>
                {evt.title}
              </span>
              {evt.skuOrItem && (
                <span className="text-[12px] text-[#6B7280] font-mono-numbers">
                  {evt.skuOrItem}
                </span>
              )}
            </div>

            <div className="flex flex-col items-end gap-0.5 text-right">
              <span className="text-[12px] text-[#6B7280] font-mono-numbers">
                {evt.timestamp}
              </span>
              {evt.deltaText && (
                <span className="text-[12px] text-[#374151]">
                  {evt.deltaText}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
