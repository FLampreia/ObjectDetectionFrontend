"use client";

import { Sidebar } from "@/layout/sideBar";

export default function Settings() {
    return (
        <div className="flex min-h-screen">

            <div className="hidden md:flex">
                <Sidebar />
            </div>
        </div>
    );
}