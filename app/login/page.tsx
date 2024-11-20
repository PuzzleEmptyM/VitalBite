"use client";

import { getProviders, signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Header Section */}
      <header className="absolute top-0 left-0 p-4">
        <img src="/images/vb_logo.png" alt="VB Logo" className="w-48 h-32 pl-14" />
      </header>

      {/* Entrance Image */}
      <section>
        <img src="/images/vitalbite.png" alt="VitalBite Logo" className="mx-auto mb-2" />
      </section>

      {/* Title */}
      <h1 className="text-5xl font-playfair font-bold text-teal mb-6">VitalBite</h1>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-sm p-3 border rounded-lg font-semibold font-playfair text-teal placeholder-teal mb-6"
      />

      {/* Password Input */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-sm p-3 border rounded-lg font-semibold text-teal placeholder-teal font-playfair mb-6"
      />

      {/* Login Button */}
      <button
        onClick={() => console.log("Login clicked")}
        className="w-full max-w-sm p-3 bg-teal text-white rounded-lg font-semibold font-playfair mb-4"
      >
        Login
      </button>

      {/* Sign in with Google Button */}
      <button
        onClick={() => signIn("google")}
        className="w-full max-w-sm p-3 bg-teal text-white rounded-lg font-playfair font-semibold mb-4"
      >
        Sign in with Google
      </button>

      {/* Create Account Link */}
      <a
        href="/create-account"
        className="text-teal font-semibold font-playfair text-sm mt-4"
      >
        Create account
      </a>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-2">
        <p className="text-center text-forest_green font-playfair">Disclaimer</p>
      </footer>
    </div>
  );
}
