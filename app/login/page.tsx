"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login successful!");
  };

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">
            CMS Platform
          </h1>

          <p className="text-blue-600 italic mt-2">
            Research Publishing System
          </p>

          <p className="text-slate-500 mt-4">
            Sign in to your account
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition"
          >
            Login
          </button>
        </div>

        <p className="text-center mt-6 text-slate-500">
          Don&apos;t have an account?
          <a
            href="/register"
            className="text-blue-700 font-medium hover:underline ml-1"
          >
            Register
          </a>
        </p>
      </div>
    </main>
  );
}