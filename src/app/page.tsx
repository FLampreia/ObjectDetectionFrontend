"use client";

import { useRouter } from "next/navigation";
import AppTitle from "@/components/textTitles";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-950 to-black text-white flex flex-col items-center px-4">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 max-w-3xl">
        <AppTitle size="lg" />

        <h2 className="text-lg sm:text-xl lg:text-2xl text-blue-200 mt-6">
          Smart Object Counting with Real-Time AI
        </h2>

        <p className="text-sm sm:text-base text-blue-300 mt-4 max-w-xl">
          Select a detection model, choose objects to track, and analyze video or live streams with real-time counting and visualization.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => router.push("/login")}
            className="bg-emerald-500 hover:bg-emerald-100 hover:text-emerald-950 font-bold py-3 px-10 rounded-2xl transition transform hover:scale-105"
          >
            Log In
          </button>

          <button
            onClick={() => router.push("/signin")}
            className="bg-transparent border border-emerald-400 hover:bg-emerald-400 hover:text-black font-bold py-3 px-10 rounded-2xl transition transform hover:scale-105"
          >
            Sign Up
          </button>
        </div>
      </section>

      {/* Demo Section */}
      <section className="w-full max-w-4xl mb-16">
        <div className="rounded-2xl overflow-hidden shadow-lg border border-blue-800">
          {/* TODO colocar imagem */}
          {/* <img
            src="/images/teste1.png"
            alt="Object counting preview"
            className="w-full h-auto"
          /> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mb-20">
        {[
          { title: "Model Selection", desc: "Choose between multiple YOLO versions." },
          { title: "Object Filtering", desc: "Select which objects to count." },
          { title: "Live & Video", desc: "Supports recorded video or live streams." },
          { title: "Real-time Counting", desc: "Instant processing with visual feedback." },
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-blue-900/40 p-6 rounded-2xl border border-blue-800"
          >
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-blue-300">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Workflow Section */}
      <section className="max-w-5xl text-center mb-20">
        <h2 className="text-2xl font-semibold mb-10">Workflow</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-blue-300">
          <div>
            <p className="font-bold text-white">1. Select Model</p>
            <p className="text-sm">Choose the detection algorithm</p>
          </div>
          <div>
            <p className="font-bold text-white">2. Choose Objects</p>
            <p className="text-sm">Pick what you want to count</p>
          </div>
          <div>
            <p className="font-bold text-white">3. Input Source</p>
            <p className="text-sm">Upload video or use live stream</p>
          </div>
          <div>
            <p className="font-bold text-white">4. Analyze</p>
            <p className="text-sm">View real-time counting and stream</p>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mb-20">
        {[
          { title: "Counting Zones", desc: "Draw custom areas before starting detection." },
          { title: "Team Roles", desc: "Admin, Operator and Viewer permissions." },
          { title: "Reports", desc: "Export counting data and analytics." },
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-blue-900/40 p-6 rounded-2xl border border-blue-800"
          >
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-blue-300">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-blue-400 text-sm pb-6 text-center">
        Built with Next.js and YOLOv8 · Real-time Object Counting Platform © {new Date().getFullYear()}
      </footer>
    </main>
  );
}
