import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <nav className="border-b border-neutral-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex gap-6">
            <a href="/dashboard" className="text-neutral-400 hover:text-white transition-colors">
              Dashboard
            </a>
            <a href="/settings" className="text-neutral-400 hover:text-white transition-colors">
              Settings
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">{user.email}</span>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
