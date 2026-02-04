"use client";

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm legend-busy" />
        <span className="text-muted-foreground">Busy</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm legend-free" />
        <span className="text-muted-foreground">Free</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm tentative-indicator" />
        <span className="text-muted-foreground">Tentative</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm legend-ooo" />
        <span className="text-muted-foreground">Out of Office</span>
      </div>
    </div>
  );
}
