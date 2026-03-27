"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-blue-900">
      <h1 className="text-8xl font-bold text-white">
        ObjectDetection
      </h1>

      <h2 className="text-2xl font-medium text-blue-200 my-5">
        Software to detect objects using Yolo Utralytics
      </h2>

      <div className="my-5 flex gap-10">
        <button 
          onClick={() => router.push("/login")}
          className="bg-emerald-950 hover:bg-emerald-100 text-white hover:text-emerald-950 font-bold py-2 px-12 rounded-2xl transition">
          LogIn
        </button>

        <button type="button" className="bg-emerald-950 hover:bg-emerald-100 text-white hover:text-emerald-950 font-bold py-2 px-12 rounded-2xl transition">
          SignIn
        </button>
      </div>

    </main>
  );
}