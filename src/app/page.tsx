"use client";

import AppTitle from "@/components/textTitles";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-blue-950 px-4 text-center">
      
      <AppTitle size="lg"/>

      <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-blue-200 my-5">
        Software to detect objects using Yolo Ultralytics
      </h2>

      <div className="my-5 flex flex-col sm:flex-row gap-4 sm:gap-10 w-full sm:w-auto">
        
        <button 
          onClick={() => router.push("/login")}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-100 text-white hover:text-emerald-950 font-bold py-2 px-8 sm:px-12 rounded-2xl transition hover:cursor-pointer">
          LogIn
        </button>

        <button 
          onClick={() => router.push("/signin")}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-100 text-white hover:text-emerald-950 font-bold py-2 px-8 sm:px-12 rounded-2xl transition hover:cursor-pointer">
          SignIn
        </button>

      </div>

    </main>
  );
}