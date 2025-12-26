import { createAdminClient } from "@/utils/supabase/admin";

export default async function Home() {
  const adminClient = await createAdminClient();
  const { data } = await adminClient.from("customers").select("*");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <header className="mb-16">
          <h1 className="text-3xl font-light tracking-tight text-white">Voistant</h1>
          <p className="mt-2 text-sm text-neutral-500">Data from Supabase</p>
        </header>

        {data &&
          data.length > 0 &&
          data.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between border-b border-neutral-800 py-4 transition-colors hover:border-neutral-600"
            >
              <span className="text-lg text-neutral-200 group-hover:text-white transition-colors">
                {item.business_name}
              </span>
              <span className="text-sm text-neutral-500">{item.contact_email}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
