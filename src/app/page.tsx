"use client";

import Header from "@/components/header";
import FeatureCard from "@/components/featureCard";

import {
  Cpu,
  Filter,
  Video,
  Activity,
  Map,
  Users,
  FileBarChart,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import GreenBtn from "@/components/greenBtn";

export default function Home() {
  const mainFeatures = [
    { title: "Model Selection", desc: "Choose between multiple YOLO versions.", icon: Cpu },
    { title: "Object Filtering", desc: "Select which objects to count.", icon: Filter },
    { title: "Live & Video", desc: "Supports recorded video or live streams.", icon: Video },
    { title: "Real-time Counting", desc: "Instant processing with visual feedback.", icon: Activity },
  ];

  const advancedFeatures = [
    { title: "Counting Zones", desc: "Draw custom areas before starting detection.", icon: Map },
    { title: "Team Roles", desc: "Admin, Operator and Viewer permissions.", icon: Users },
    { title: "Reports", desc: "Export counting data and analytics.", icon: FileBarChart },
  ];

  const steps = [
    { title: "Select Model", desc: "Choose the detection algorithm" },
    { title: "Choose Objects", desc: "Pick what you want to count" },
    { title: "Input Source", desc: "Upload video or use live stream" },
    { title: "Analyze", desc: "View real-time counting and stream" },
  ];

  // const user = {
  //   name: "Francisco",
  //   email: "francisco@gmail.com"
  // }; // TODO simulação (substituir por auth real)

  const user = null;

  return (
    <>
      <Header user={user} />
      {/* <Header/> */}

      <section
        id="#"
        className="flex flex-col items-center justify-center text-center py-24 max-w-3xl"
      >

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-100 mt-6 leading-snug">
          Smart Object Counting with{" "}
          <span className="text-emerald-400">Real-Time AI</span>
        </h2>

        <p className="text-sm sm:text-base text-blue-300 mt-5 max-w-xl leading-relaxed">
          Select a detection model, define which objects to track, and process video
          or live streams with accurate, real-time counting and visual feedback.
        </p>

        <div className="mt-8">
          {user ? (
            <>
              <GreenBtn desc="Dashboard" href="/dashboard" />  {/*TODO colocar url de referencia para dashboard*/}
            </>
          ) : (
            <GreenBtn desc="Get started" href="/auth" />
          )}
        </div>

      </section>

      {/* Demo section */}
      <section
        id="demo"
        className="w-full max-w-4xl mb-16 scroll-mt-24"
      >
        <div className="rounded-2xl overflow-hidden shadow-lg border border-blue-800">
          {/* TODO futura imagem ou vídeo */}
          <img src="/images/image.png" alt="preview" />
        </div>
      </section>

      {/* Features section */}
      <section
        id="features"
        className="grid gap-6 max-w-5xl mb-20 scroll-mt-24 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {mainFeatures.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </section>

      <section
        className="grid gap-6 max-w-5xl mb-20 scroll-mt-24 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {advancedFeatures.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </section>

      {/* Workflow section */}
      <section
        id="workflow"
        className="max-w-5xl text-center mb-20 scroll-mt-24"
      >
        <h2 className="text-2xl font-semibold mb-10">Workflow</h2>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 text-blue-300">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col lg:flex-row items-center flex-1 w-full lg:w-auto">

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-auto">
                <p className="font-bold text-white whitespace-nowrap">
                  {i + 1}. {step.title}
                </p>
                <p className="text-sm opacity-80 max-w-50">
                  {step.desc}
                </p>
              </div>

              {/* Arrow: Right side on desktop, down side on mobile */}
              {i < steps.length - 1 && (
                <div className="flex items-center justify-center py-4 lg:py-0 lg:px-6">
                  <ChevronRight className="hidden lg:block text-blue-800 w-6 h-6" />
                  <ChevronDown className="lg:hidden text-blue-800 w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="text-blue-400 text-sm pb-6 text-center">
        <p>
          Built with Next.js and YOLO · Real-time Object Counting Platform © {new Date().getFullYear()}
        </p>
        <p className="mt-1">
          Developed by Francisco Lampreia
        </p>
      </footer>
    </>
  );
}