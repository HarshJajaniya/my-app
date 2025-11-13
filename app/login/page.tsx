"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome Back</h1>
        <p className="text-gray-600 mb-6">Sign in to your account</p>

        <button
          onClick={() => signIn("github")}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
