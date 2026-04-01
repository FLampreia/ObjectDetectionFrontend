"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppTitle from "@/components/textTitles";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await new Promise((res) => setTimeout(res, 1000));
      console.log({ email, password });
      router.push("/home");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-blue-950 to-black px-4 sm:px-6">

      <AppTitle size="lg" />

      <div className="w-full max-w-md bg-blue-900/40 rounded-2xl shadow-xl p-6 sm:p-8 my-6 sm:my-8 border border-blue-800">

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white">
          Welcome Back
        </h1>

        <p className="text-center text-blue-200 mt-2 mb-6 text-sm sm:text-base">
          Login to access your dashboard
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-xs sm:text-sm text-blue-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <label className="flex items-center gap-2 text-blue-200">
              <input type="checkbox" className="accent-blue-600" />
              Remember me
            </label>

            <button
              type="button"
              className="text-blue-200 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-100 text-white hover:text-emerald-950 font-bold py-2.5 rounded-lg transition mt-2 disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

        </form>

        <div className="mt-6 text-center text-xs sm:text-sm text-white">
          Don’t have an account?
          <button
            onClick={() => router.push("/signin")}
            className="text-blue-200 hover:underline ml-1"
          >
            Sign up
          </button>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-4 text-xs sm:text-sm text-blue-200 hover:underline w-full"
        >
          Back to home
        </button>

      </div>

    </main>
  );
}