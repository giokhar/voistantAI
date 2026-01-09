import { createClient } from "@/utils/supabase/server";

export default async function Settings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-3xl font-light text-white mb-8">Settings</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-light text-white mb-4">Account</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-neutral-500 mb-1">Email</label>
            <div className="text-neutral-200">{user?.email}</div>
          </div>
          <div>
            <label className="block text-sm text-neutral-500 mb-1">User ID</label>
            <div className="text-neutral-600 text-xs font-mono">{user?.id}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
