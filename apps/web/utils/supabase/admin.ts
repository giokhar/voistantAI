"use server";
// This client is used to bypass RLS. Only use server-side (API routes, webhooks, admin pages)
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@packages/db";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const secretKey = process.env.SUPABASE_SECRET_KEY!;

// Admin client - bypasses RLS. Only use server-side (API routes, webhooks)
export const createAdminClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl!, secretKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
