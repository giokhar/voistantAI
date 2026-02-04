"use client";

import { useState, useTransition } from "react";
import { Button } from "@packages/ui/components/button";
import { Input } from "@packages/ui/components/input";
import { Label } from "@packages/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@packages/ui/components/select";
import { cn } from "@packages/ui/lib/utils";
import { updateUserPreferences, type UserPreferences } from "../../app/(protected)/settings/actions";

// Common timezones grouped by region
const TIMEZONES = [
  // North America
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
] as const;

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

interface WorkingHoursFormProps {
  preferences: UserPreferences | null;
}

export function WorkingHoursForm({ preferences }: WorkingHoursFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Default times from database or fallback to 9-5
  const defaultStart = preferences?.work_day_start?.slice(0, 5) || "09:00";
  const defaultEnd = preferences?.work_day_end?.slice(0, 5) || "17:00";
  const defaultTimezone = preferences?.timezone || "America/New_York";

  const [startTime, setStartTime] = useState(defaultStart);
  const [endTime, setEndTime] = useState(defaultEnd);
  const [timezone, setTimezone] = useState(defaultTimezone);

  // Handle start time change with automatic end time adjustment
  const handleStartTimeChange = (newStartTime: string) => {
    if (!newStartTime) return;

    const startMinutes = timeToMinutes(newStartTime);
    const endMinutes = timeToMinutes(endTime);

    // If end time is now invalid (less than or equal to start), adjust it
    if (endMinutes <= startMinutes) {
      setStartTime(newStartTime);
      setEndTime(getNextTimeSlot(newStartTime));
    } else {
      setStartTime(newStartTime);
    }
  };

  // Handle end time change with validation
  const handleEndTimeChange = (newEndTime: string) => {
    if (!newEndTime) return;

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(newEndTime);

    // Only allow end times after start time
    if (endMinutes > startMinutes) {
      setEndTime(newEndTime);
    }
  };

  // Check if there's a time validation error
  const hasTimeError = timeToMinutes(endTime) <= timeToMinutes(startTime);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData();
    formData.set("work_day_start", startTime);
    formData.set("work_day_end", endTime);
    formData.set("timezone", timezone);

    startTransition(async () => {
      const result = await updateUserPreferences(formData);
      if (result.success) {
        setMessage({ type: "success", text: "Preferences saved successfully" });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save preferences" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="work-start-time">Work Day Start</Label>
            <Input
              id="work-start-time"
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white appearance-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="work-end-time">Work Day End</Label>
            <Input
              id="work-end-time"
              type="time"
              value={endTime}
              min={startTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className={cn(
                "bg-neutral-800 border-neutral-700 text-white appearance-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70",
                hasTimeError && "border-red-500 focus-visible:ring-red-500",
              )}
            />
          </div>
        </div>
        {hasTimeError && <p className="text-xs text-red-500">End time must be after start time</p>}

        {/* Timezone Selector */}
        <div className="grid gap-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs text-neutral-500">
          Set your default working hours and timezone. This will be used to display your availability on the calendar.
        </p>
      </div>

      {message && (
        <p className={cn("text-sm", message.type === "success" ? "text-green-500" : "text-red-500")}>{message.text}</p>
      )}

      <Button type="submit" disabled={isPending || hasTimeError} className="w-full sm:w-auto">
        {isPending ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  );
}
