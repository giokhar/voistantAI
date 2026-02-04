import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, setHours, setMinutes, addDays } from "date-fns";
import { enUS } from "date-fns/locale";
import { DEFAULT_WORKING_HOURS, type CalendarEvent, type EventFormData, type ShowAsStatus, type WorkingHoursConfig } from "./types";

// Localizer configuration
const locales = {
  "en-US": enUS,
};

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }), // Start week on Monday
  getDay,
  locales,
});

// Get the user's local timezone
export const getUserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

// Generate time options for select dropdowns
export const generateTimeOptions = (workingHoursOnly: boolean = true, workingHours: WorkingHoursConfig = DEFAULT_WORKING_HOURS) => {
  const options: { value: string; label: string }[] = [];
  const startHour = workingHoursOnly ? workingHours.start : 0;
  const endHour = workingHoursOnly ? workingHours.end : 24;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Don't add times past the end hour
      if (hour === endHour && minute > 0) continue;
      if (hour === 24) continue; // Skip 24:00
      const h = hour.toString().padStart(2, "0");
      const m = minute.toString().padStart(2, "0");
      const label = format(setMinutes(setHours(new Date(), hour), minute), "h:mm a");
      options.push({ value: `${h}:${m}`, label });
    }
  }
  return options;
};

export const allTimeOptions = generateTimeOptions(false);

// Check if a slot is bookable (within working hours and on a working day)
export const isBookableSlot = (date: Date, workingHours: WorkingHoursConfig = DEFAULT_WORKING_HOURS): boolean => {
  const hour = date.getHours();
  const dayOfWeek = date.getDay();
  return (
    workingHours.workingDays.includes(dayOfWeek) &&
    hour >= workingHours.start &&
    hour < workingHours.end
  );
};

// Check if a time slot is within working hours
export const isWorkingHour = (date: Date, workingHours: WorkingHoursConfig = DEFAULT_WORKING_HOURS): boolean => {
  const hour = date.getHours();
  const dayOfWeek = date.getDay();
  return (
    workingHours.workingDays.includes(dayOfWeek) &&
    hour >= workingHours.start &&
    hour < workingHours.end
  );
};

// Check if a day is a working day
export const isWorkingDay = (date: Date, workingHours: WorkingHoursConfig = DEFAULT_WORKING_HOURS): boolean => {
  return workingHours.workingDays.includes(date.getDay());
};

// Parse time string (HH:MM:SS or HH:MM) to hour number
export const parseTimeToHour = (time: string): number => {
  const [hours] = time.split(":").map(Number);
  return hours;
};

// Create sample events for demonstration
export const createSampleEvents = (timezone?: string): CalendarEvent[] => {
  const userTz = timezone || getUserTimezone();
  const now = new Date();
  
  return [
    {
      id: "1",
      title: "Team Meeting",
      start: setMinutes(setHours(now, 10), 0),
      end: setMinutes(setHours(now, 11), 0),
      description: "Weekly team sync",
      timezone: userTz,
      eventType: "appointment",
      showAs: "busy",
    },
    {
      id: "2",
      title: "Client Call",
      start: setMinutes(setHours(now, 14), 0),
      end: setMinutes(setHours(now, 15), 0),
      description: "Discuss project requirements",
      timezone: userTz,
      eventType: "appointment",
      showAs: "busy",
    },
    {
      id: "3",
      title: "Tentative: Lunch Meeting",
      start: addDays(setMinutes(setHours(now, 12), 0), 1),
      end: addDays(setMinutes(setHours(now, 13), 0), 1),
      description: "Lunch with potential client",
      timezone: userTz,
      eventType: "appointment",
      showAs: "tentative",
    },
  ];
};

// Format timezone for display (e.g., "America/New_York" -> "Eastern Time")
export const formatTimezoneDisplay = (timezone: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'long',
    });
    const parts = formatter.formatToParts(new Date());
    const tzName = parts.find(part => part.type === 'timeZoneName');
    return tzName?.value || timezone;
  } catch {
    return timezone;
  }
};

// Get short timezone abbreviation (e.g., "EST", "PST")
export const getTimezoneAbbr = (timezone: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(new Date());
    const tzName = parts.find(part => part.type === 'timeZoneName');
    return tzName?.value || timezone;
  } catch {
    return timezone;
  }
};

// Get default form state
export const getDefaultEventForm = (): EventFormData => ({
  title: "",
  description: "",
  date: new Date(),
  endDate: undefined,
  startTime: "09:00",
  endTime: "10:00",
  allDay: false,
  showAs: "busy" as ShowAsStatus,
});
