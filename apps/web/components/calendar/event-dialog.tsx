"use client";

import { format } from "date-fns";
import { Button } from "@packages/ui/components/button";
import { Input } from "@packages/ui/components/input";
import { Label } from "@packages/ui/components/label";
import { Switch } from "@packages/ui/components/switch";
import { Calendar } from "@packages/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@packages/ui/components/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@packages/ui/components/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@packages/ui/lib/utils";
import { SHOW_AS_OPTIONS, type EventFormData, type ShowAsStatus } from "../../app/(protected)/calendar/types";

// Helper to convert time string to minutes for comparison
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Get the next available time slot (30 min after given time)
const getNextTimeSlot = (time: string): string => {
  const minutes = timeToMinutes(time) + 30;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  // Cap at 23:30
  if (hours >= 24) return "23:30";
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EventFormData;
  onFormChange: (data: EventFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function EventDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSave,
  onCancel,
  isEditing,
}: EventDialogProps) {
  // Handle start time change with automatic end time adjustment
  const handleStartTimeChange = (newStartTime: string) => {
    if (!newStartTime) return;

    const startMinutes = timeToMinutes(newStartTime);
    const endMinutes = timeToMinutes(formData.endTime);

    // If end time is now invalid (less than or equal to start), adjust it
    if (endMinutes <= startMinutes) {
      onFormChange({
        ...formData,
        startTime: newStartTime,
        endTime: getNextTimeSlot(newStartTime),
      });
    } else {
      onFormChange({ ...formData, startTime: newStartTime });
    }
  };

  // Handle end time change with validation
  const handleEndTimeChange = (newEndTime: string) => {
    if (!newEndTime) return;

    const startMinutes = timeToMinutes(formData.startTime);
    const endMinutes = timeToMinutes(newEndTime);

    // Only allow end times after start time
    if (endMinutes > startMinutes) {
      onFormChange({ ...formData, endTime: newEndTime });
    }
  };

  // Check if there's a time validation error
  const hasTimeError = timeToMinutes(formData.endTime) <= timeToMinutes(formData.startTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Add Event"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the event details below." : "Create a new event on your calendar."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="event-title">Title</Label>
            <Input
              id="event-title"
              placeholder="e.g., Client meeting, Vacation, Doctor appointment"
              value={formData.title}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="event-description">Description (optional)</Label>
            <Input
              id="event-description"
              placeholder="Add any notes or details"
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Show As */}
          <div className="grid gap-2">
            <Label>Show As</Label>
            <Select
              value={formData.showAs}
              onValueChange={(value: ShowAsStatus) => onFormChange({ ...formData, showAs: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SHOW_AS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-sm", option.bgClass || option.color)} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="event-allday" className="cursor-pointer">
              All day
            </Label>
            <Switch
              id="event-allday"
              checked={formData.allDay}
              onCheckedChange={(checked) =>
                onFormChange({
                  ...formData,
                  allDay: checked,
                  endDate: checked ? undefined : undefined,
                })
              }
            />
          </div>

          {/* Date Picker */}
          <div className="grid gap-2">
            <Label>{formData.allDay ? "Date Range" : "Date"}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !formData.date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.allDay
                    ? formData.endDate
                      ? `${format(formData.date, "MMM d")} – ${format(formData.endDate, "MMM d, yyyy")}`
                      : format(formData.date, "PPP")
                    : formData.date
                      ? format(formData.date, "PPP")
                      : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                {formData.allDay ? (
                  <Calendar
                    mode="range"
                    selected={{
                      from: formData.date,
                      to: formData.endDate || formData.date,
                    }}
                    onSelect={(range) => {
                      if (range?.from) {
                        onFormChange({
                          ...formData,
                          date: range.from,
                          endDate: range.to || undefined,
                        });
                      }
                    }}
                    numberOfMonths={2}
                  />
                ) : (
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && onFormChange({ ...formData, date })}
                  />
                )}
              </PopoverContent>
            </Popover>
            {formData.allDay && (
              <p className="text-xs text-muted-foreground">Select a single date or drag to select multiple days</p>
            )}
          </div>

          {/* Time Pickers - only when not all day */}
          {!formData.allDay && (
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={formData.endTime}
                    min={formData.startTime}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className={cn(
                      "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
                      hasTimeError && "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                </div>
              </div>
              {hasTimeError && <p className="text-xs text-destructive">End time must be after start time</p>}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!formData.title.trim() || (!formData.allDay && hasTimeError)}>
            {isEditing ? "Save Changes" : "Add Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
