import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from("test").select("*");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <header className="mb-16">
          <h1 className="text-3xl font-light tracking-tight text-white">Voistant</h1>
          <p className="mt-2 text-sm text-neutral-500">Data from Supabase</p>
        </header>

        <section>
          {data && data.length > 0 ? (
            <ul className="space-y-3">
              {data.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-center justify-between border-b border-neutral-800 py-4 transition-colors hover:border-neutral-600"
                >
                  <span className="text-lg text-neutral-200 group-hover:text-white transition-colors">{item.name}</span>
                  <span className="text-xs tabular-nums text-neutral-600">#{item.id}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500">No items yet.</p>
          )}
        </section>

        <footer className="mt-24 pt-8 border-t border-neutral-800">
          <p className="text-xs text-neutral-600">
            {data?.length ?? 0} {data?.length === 1 ? "item" : "items"}
          </p>
        </footer>
      </div>
    </div>
  );
}
