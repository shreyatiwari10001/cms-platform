"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    console.log(data);
    alert("Registration successful!");
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
            Create your account
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
            placeholder="Create a password"
            className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition"
          >
            Register
          </button>
        </div>

        <p className="text-center mt-6 text-slate-500">
          Already have an account?
          <a
            href="/login"
            className="text-blue-700 font-medium hover:underline ml-1"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}