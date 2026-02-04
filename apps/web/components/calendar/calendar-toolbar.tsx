"use client";

import { Views, type View } from "react-big-calendar";
import { format } from "date-fns";
import { Button } from "@packages/ui/components/button";
import { CardTitle } from "@packages/ui/components/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarToolbarProps {
  date: Date;
  view: View;
  onViewChange: (view: View) => void;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  onGoToToday: () => void;
}

export function CalendarToolbar({
  date,
  view,
  onViewChange,
  onNavigateBack,
  onNavigateForward,
  onGoToToday,
}: CalendarToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="text-xl">
        {format(date, view === Views.DAY ? "MMMM d, yyyy" : "MMMM yyyy")}
      </CardTitle>
      <div className="flex items-center gap-2">
        {/* Navigation controls */}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={onNavigateBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={onGoToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={onNavigateForward}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant={view === Views.DAY ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange(Views.DAY)}
          >
            Day
          </Button>
          <Button
            variant={view === Views.WORK_WEEK ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange(Views.WORK_WEEK)}
          >
            Work Week
          </Button>
          <Button
            variant={view === Views.WEEK ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange(Views.WEEK)}
          >
            Week
          </Button>
          <Button
            variant={view === Views.MONTH ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange(Views.MONTH)}
          >
            Month
          </Button>
        </div>
      </div>
    </div>
  );
}
