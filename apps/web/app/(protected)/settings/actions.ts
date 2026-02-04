"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type UserPreferences = {
  id: string;
  user_id: string;
  work_day_start: string;
  work_day_end: string;
  timezone: string;
  created_at: string | null;
  updated_at: string | null;
};

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error fetching preferences:", error);
    return null;
  }

  return data;
}

export async function updateUserPreferences(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const workDayStart = formData.get("work_day_start") as string;
  const workDayEnd = formData.get("work_day_end") as string;
  const timezone = formData.get("timezone") as string;

  if (!workDayStart || !workDayEnd) {
    return { success: false, error: "Both start and end times are required" };
  }

  if (!timezone) {
    return { success: false, error: "Timezone is required" };
  }

  // Validate that end time is after start time
  const startMinutes = timeToMinutes(workDayStart);
  const endMinutes = timeToMinutes(workDayEnd);

  if (endMinutes <= startMinutes) {
    return { success: false, error: "End time must be after start time" };
  }

  // Upsert the preferences (insert or update)
  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: user.id,
      work_day_start: workDayStart,
      work_day_end: workDayEnd,
      timezone: timezone,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    console.error("Error updating preferences:", error);
    return { success: false, error: "Failed to save preferences" };
  }

  revalidatePath("/settings");
  return { success: true };
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
