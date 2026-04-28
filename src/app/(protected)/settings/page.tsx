"use client";

import { useState } from "react";
import { Save, Trash2, User, Lock, BadgeInfo } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from "@/components/userAvatar";

export default function Settings() {
    const { user } = useAuth();

    const [username, setUsername] = useState(user?.username);
    const [fullName, setFullName] = useState(user?.full_name);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmDelete, setConfirmDelete] = useState("");

    const handleProfileSave = () => {
        console.log("Guardar perfil");
    };

    const handlePasswordChange = () => {
        console.log("Alterar password");
    };

    const handleDeleteAccount = () => {
        console.log("Eliminar conta");
    };

    // TODO FAZER OS ENPOINTS

    return (
        <div className="flex min-h-screen">

            <main className="flex-1 p-8 max-w-4xl mx-auto w-full">

                <h1 className="text-3xl font-bold mb-8">Settings</h1>

                <div className="space-y-6">

                    {/* Profile */}
                    <section className="bg-slate-950 border border-blue-900 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-5 h-5 text-emerald-500" />
                            <h2 className="text-xl font-semibold">Account Personal Data</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-zinc-400 block mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full border border-blue-900 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-400 block mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full border border-blue-900 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-400 block mb-2">
                                    Email
                                </label>

                                <div className="w-full bg-blue-950 border border-blue-900 rounded-xl px-4 py-3 text-zinc-400 cursor-not-allowed select-none">
                                    {user?.email}
                                </div>
                            </div>

                            <button
                                onClick={handleProfileSave}
                                className="mt-2 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-700 transition px-5 py-3 rounded-xl font-medium cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </section>

                    {/* Password */}
                    <section className="bg-slate-950 border border-blue-900 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="w-5 h-5 text-emerald-500" />
                            <h2 className="text-xl font-semibold">Privacy</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-zinc-400 block mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full border border-blue-900 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-400 block mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border border-blue-900 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-400 block mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border border-blue-900 rounded-xl px-4 py-3 outline-none focus:border-green-500"
                                />
                            </div>

                            <button
                                onClick={handlePasswordChange}
                                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-green-700 transition px-5 py-3 rounded-xl font-medium"
                            >
                                <Save className="w-4 h-4" />
                                Atualizar Password
                            </button>
                        </div>
                    </section>

                    {/* Eliminar Conta */}
                    <section className="bg-red-950/30 border border-red-900 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BadgeInfo className="w-5 h-5 text-red-500" />
                            <h2 className="text-xl font-semibold text-red-400">
                                Delete Account
                            </h2>
                        </div>

                        <p className="text-sm text-zinc-400 mb-4">
                            This action is permanent and cannot be undone.
                        </p>

                        <div className="mb-4">
                            <label className="text-sm text-zinc-400 block mb-2">
                                Write <span className="font-semibold text-white">DELETE</span>{" "}
                                to confirm
                            </label>

                            <input
                                type="text"
                                value={confirmDelete}
                                onChange={(e) => setConfirmDelete(e.target.value)}
                                className="w-full  border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-500"
                            />
                        </div>

                        <button
                            onClick={handleDeleteAccount}
                            disabled={confirmDelete !== "DELETE"}
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:text-zinc-400 transition px-5 py-3 rounded-xl font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
}