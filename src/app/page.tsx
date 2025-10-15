import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <h1 className="text-5xl font-bold mb-6">DevPilot</h1>
        <p className="text-xl max-w-xl mb-8">
          Build, edit, and fix your applications instantly with AI-powered agents.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-md shadow hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
          <Link
            href="/pricing"
            className="px-6 py-3 border border-white font-semibold rounded-md hover:bg-white hover:text-purple-700 transition"
          >
            Pricing
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">Connect Repos</h2>
          <p>Link your GitHub repositories in seconds and let AI take care of your code.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">AI-Powered Edits</h2>
          <p>Chat with our AI agents to generate, fix, or improve your code automatically.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">Seamless Workflow</h2>
          <p>Approve changes, create pull requests, and deploy faster than ever before.</p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-purple-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to accelerate your development?</h2>
        <Link
          href="/login"
          className="px-8 py-4 bg-white text-purple-700 font-semibold rounded-md shadow hover:bg-gray-100 transition"
        >
          Start Building
        </Link>
      </section>
    </main>
  );
}
