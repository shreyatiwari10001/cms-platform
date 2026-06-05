"use client";
import Link from "next/link";
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

    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            email: user.email,
            role: "user",
          },
        ]);

      if (profileError) {
        alert(profileError.message);
        return;
      }
    }

    alert("Registration successful!");
  };

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-blue-100 p-16">
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
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full h-14 px-4 text-lg rounded-lg bg-white border border-slate-300 text-black"
/>

<input
  type="password"
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full h-14 px-4 text-lg rounded-lg bg-white border border-slate-300 text-black"
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
          
          <Link href="/login">
            Login
          </Link>
          
        </p>
      </div>
    </main>
  );
}