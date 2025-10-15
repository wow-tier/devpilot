export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-24">
      <h1 className="text-4xl font-bold mb-12">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-6">
        <div className="p-8 bg-white rounded-lg shadow text-center">
          <h2 className="text-2xl font-semibold mb-4">Free</h2>
          <p className="text-gray-500 mb-6">Limited AI edits per month</p>
          <p className="text-3xl font-bold mb-6">$0</p>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
            Start Free
          </button>
        </div>
        <div className="p-8 bg-white rounded-lg shadow text-center border-2 border-purple-600">
          <h2 className="text-2xl font-semibold mb-4">Pro</h2>
          <p className="text-gray-500 mb-6">Unlimited AI edits + priority support</p>
          <p className="text-3xl font-bold mb-6">$29/mo</p>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
            Start Pro
          </button>
        </div>
        <div className="p-8 bg-white rounded-lg shadow text-center">
          <h2 className="text-2xl font-semibold mb-4">Enterprise</h2>
          <p className="text-gray-500 mb-6">Team collaboration and custom integrations</p>
          <p className="text-3xl font-bold mb-6">Contact Us</p>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
