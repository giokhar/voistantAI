"use client";

import { format, addDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "@packages/ui/components/button";
import { Label } from "@packages/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@packages/ui/components/dialog";
import { Trash2, Pencil } from "lucide-react";
import { cn } from "@packages/ui/lib/utils";
import { SHOW_AS_OPTIONS, type CalendarEvent } from "../../app/(protected)/calendar/types";

interface ViewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  userTimezone: string;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export function ViewEventDialog({ open, onOpenChange, event, userTimezone, onEdit, onDelete }: ViewEventDialogProps) {
  if (!event) return null;

  const formatEventTime = (event: CalendarEvent) => {
    const tz = event.timezone || userTimezone;
    const startFormatted = formatInTimeZone(event.start, tz, "h:mm a");
    const endFormatted = formatInTimeZone(event.end, tz, "h:mm a");
    const tzAbbr = formatInTimeZone(event.start, tz, "zzz");
    return `${startFormatted} - ${endFormatted} (${tzAbbr})`;
  };

  const showAsOption = SHOW_AS_OPTIONS.find((o) => o.value === event.showAs);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>
            <span className="flex items-center gap-2">
              <span
                className={cn("w-2 h-2 rounded-sm", showAsOption?.bgClass || showAsOption?.color || "bg-blue-600")}
              />
              {showAsOption?.label || "Event"}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {event.description && (
            <div className="grid gap-1">
              <Label className="text-muted-foreground text-xs">Description</Label>
              <p className="text-sm">{event.description}</p>
            </div>
          )}
          <div className="grid gap-1">
            <Label className="text-muted-foreground text-xs">Date</Label>
            <p className="text-sm">
              {event.allDay && format(event.start, "yyyy-MM-dd") !== format(addDays(event.end, -1), "yyyy-MM-dd")
                ? `${format(event.start, "MMM d")} – ${format(addDays(event.end, -1), "MMM d, yyyy")}`
                : format(event.start, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          {!event.allDay && (
            <div className="grid gap-1">
              <Label className="text-muted-foreground text-xs">Time</Label>
              <p className="text-sm">{formatEventTime(event)}</p>
            </div>
          )}
          {event.allDay && (
            <div className="grid gap-1">
              <Label className="text-muted-foreground text-xs">Duration</Label>
              <p className="text-sm">All day</p>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="destructive" onClick={() => onDelete(event.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => onEdit(event)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
