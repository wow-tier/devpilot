'use client';

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Sign in to DevPilot</h1>
        <button
          onClick={() => signIn('google')}
          className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 transition"
        >
          Sign in with Google
        </button>
        <p className="mt-4 text-gray-500 text-sm">
          You will be redirected to your GitHub repositories after login.
        </p>
      </div>
    </div>
  );
}
