import { Circle, Plane } from "lucide-react";

// Event types
export type EventType = "appointment" | "availability" | "time-off";

// Show As status (Outlook-style)
export type ShowAsStatus = "busy" | "free" | "tentative" | "out-of-office";

export interface ShowAsOption {
  value: ShowAsStatus;
  label: string;
  icon: typeof Circle;
  color: string;
  bgClass?: string;
}

export const SHOW_AS_OPTIONS: ShowAsOption[] = [
  { value: "busy", label: "Busy", icon: Circle, color: "showas-busy" },
  { value: "free", label: "Free", icon: Circle, color: "showas-free" },
  { value: "tentative", label: "Tentative", icon: Circle, color: "showas-tentative", bgClass: "tentative-indicator" },
  { value: "out-of-office", label: "Out of Office", icon: Plane, color: "showas-ooo" },
];

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  description?: string;
  timezone?: string;
  eventType: EventType;
  showAs?: ShowAsStatus;
}

export interface EventFormData {
  title: string;
  description: string;
  date: Date;
  endDate: Date | undefined;
  startTime: string;
  endTime: string;
  allDay: boolean;
  showAs: ShowAsStatus;
}

// Working hours configuration
export const WORKING_HOURS: {
  start: number;
  end: number;
  workingDays: readonly number[];
} = {
  start: 9, // 9 AM
  end: 17, // 5 PM
  // Days where appointments can be booked (0 = Sunday, 6 = Saturday)
  workingDays: [1, 2, 3, 4, 5], // Monday through Friday
};
