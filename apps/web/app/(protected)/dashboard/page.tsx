"use server";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/utils/roles";

export default async function Dashboard() {
  const userIsAdmin = await isAdmin();

  if (userIsAdmin) {
    // Admin view - all customers (RLS policies grant admin full access)
    const supabase = await createClient();
    const { data: customers } = await supabase.from("customers").select("*");

    return (
      <div>
        <h1 className="text-3xl font-light text-white mb-8">Admin Dashboard</h1>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-light text-white mb-4">All Customers</h2>

          {customers && customers.length > 0 ? (
            <div className="space-y-3">
              {customers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <div className="text-lg text-neutral-200">{customer.business_name}</div>
                    <div className="text-sm text-neutral-500">{customer.contact_email}</div>
                  </div>
                  <div className="text-sm text-neutral-600">
                    {customer.is_active ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-red-500">Inactive</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">No customers yet.</p>
          )}
        </div>
      </div>
    );
  }

  // Regular user view
  return (
    <div>
      <h1 className="text-3xl font-light text-white mb-8">Your Dashboard</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <p className="text-neutral-400">Welcome! Your dashboard features are coming soon.</p>
      </div>
    </div>
  );
}
