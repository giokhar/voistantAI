import { createClient } from "@/utils/supabase/server";
import { CalendarClient } from "@/components/calendar";
import { DEFAULT_WORKING_HOURS, type WorkingHoursConfig } from "./types";

// Parse time string (HH:MM:SS or HH:MM) to hour number
function parseTimeToHour(time: string): number {
  const [hours] = time.split(":").map(Number);
  return hours;
}

async function getUserWorkingHours(): Promise<WorkingHoursConfig> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return DEFAULT_WORKING_HOURS;
  }

  const { data: preferences, error } = await supabase
    .from("user_preferences")
    .select("work_day_start, work_day_end, timezone")
    .eq("user_id", user.id)
    .single();

  if (error || !preferences) {
    return DEFAULT_WORKING_HOURS;
  }

  return {
    start: parseTimeToHour(preferences.work_day_start),
    end: parseTimeToHour(preferences.work_day_end),
    workingDays: DEFAULT_WORKING_HOURS.workingDays, // Keep default working days for now
    timezone: preferences.timezone,
  };
}

export default async function CalendarPage() {
  const workingHours = await getUserWorkingHours();

  return <CalendarClient workingHours={workingHours} />;
}
