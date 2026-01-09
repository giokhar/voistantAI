export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-light tracking-tight text-white mb-4">Voistant</h1>
          <p className="text-lg text-neutral-400 mb-8">AI-powered voice assistant for your business</p>
          <div className="flex gap-4 justify-center">
            <a
              href="/login"
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors"
            >
              Login
            </a>
            <a
              href="/signup"
              className="px-6 py-3 border border-neutral-700 text-white rounded-lg font-medium hover:border-neutral-500 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-xl font-light text-white mb-3">Call Management</h3>
            <p className="text-neutral-500">Track and manage all your AI-powered calls in one place</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-xl font-light text-white mb-3">Analytics</h3>
            <p className="text-neutral-500">Get insights from call transcripts and analysis</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-xl font-light text-white mb-3">Notifications</h3>
            <p className="text-neutral-500">Receive SMS updates for important call events</p>
          </div>
        </div>
      </div>
    </div>
  );
}
