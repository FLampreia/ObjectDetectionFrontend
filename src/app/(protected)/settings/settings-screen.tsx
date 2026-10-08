
"use client";

import { useState } from "react";
import { Save, Trash2, User, Lock, BadgeInfo, Settings } from "lucide-react";
import { PageHeader } from "@/components/custom/layout/page-header";
import { useAuth } from "@/hooks/use-auth";
import { updateUsername, updateFullName, updatePassword, deletePassword } from "@/services/user";
import { useRouter } from "next/navigation";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";

export default function SettingsScreen() {
    const { user, refreshUser, logout } = useAuth();

    const [username, setUsername] = useState(() => user?.username ?? "");
    const [fullName, setFullName] = useState(() => user?.full_name ?? "");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmDelete, setConfirmDelete] = useState("");

    const router = useRouter();

    const handleProfileSave = async () => {
        if (!user?.id) return;

        try {

            if (username != user?.username) {
                await updateUsername(user.id, username);
                await refreshUser();
            }

            if (fullName != user?.full_name) {
                await updateFullName(user.id, fullName);
                await refreshUser();
            }



        } catch (err) {
            console.error(err);
        }
    };

    const handlePasswordChange = async () => {
        if (!user?.id) return;

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await updatePassword(user.id, newPassword, currentPassword);
            await refreshUser();

            alert("Password updated successfully");
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Failed to update password");
            }
        }

        //TODO utilizar set error ou forma mais otimizada

        // TODO invalidar refresh tokens
        // obrigar re-login
        // ou regenerar access token


    };

    const handleDeleteAccount = async () => {
        if (!user?.id) return;

        try {
            await deletePassword(user.id);

            logout();

            router.replace("/");

        } catch (err) {
            console.error(err);
        }
    };
    return (


        <main className="flex-1 max-w-7xl mx-auto w-full flex-col justify-between">

            <PageHeader
                title="Settings"
                description="Manage your profile, password and account preferences."
                icon={<Settings />}
            />

            <div className="space-y-8 pb-8">

                {/* Profile */}
                <section className="p-6 bg-primary pt-4 shadow-xs ring-secondary ring-inset lg:rounded-xl lg:ring-1">

                    <div className="flex items-center gap-3 mb-6">
                        <User className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-xl font-semibold">Account Personal Data</h2>
                    </div>

                    <div className="space-y-4">

                        <Input type="text" label="Username" value={username} onChange={(value) => setUsername(value)} />

                        <Input type="text" label="Full Name" value={fullName} onChange={(value) => setFullName(value)} />

                        <Input type="text" label="Email" value={user?.email} isDisabled />

                        <Button size="lg" iconLeading={<Save data-icon />} onClick={handleProfileSave}>
                            Save Changes
                        </Button>

                    </div>
                </section>

                {/* Password */}
                <section className="p-6 bg-primary pt-4 shadow-xs ring-secondary ring-inset lg:rounded-xl lg:ring-1">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-xl font-semibold">Privacy</h2>
                    </div>

                    <div className="space-y-4">


                        <Input type="password" label="Current Password" placeholder="••••••••" onChange={(value) => setCurrentPassword(value)} />

                        <Input type="password" label="New Password" placeholder="••••••••" onChange={(value) => setNewPassword(value)} />

                        <Input type="password" label="Confirm New Password" placeholder="••••••••" onChange={(value) => setConfirmPassword(value)} />

                        <Button size="lg" iconLeading={<Save data-icon />} onClick={handlePasswordChange}>
                            Update Password
                        </Button>
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

                    <p className="color">
                        This action is permanent and cannot be undone.
                    </p>

                    <div className="mb-4">
                        <label className="text-sm text-zinc-400 block mb-2">
                            Write <span className="font-semibold text-white">{user?.username}</span>{" "}
                            to confirm
                        </label>

                        <input
                            type="text"
                            value={confirmDelete}
                            onChange={(e) => setConfirmDelete(e.target.value)}
                            className="w-full  border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-500"
                        />
                    </div>


                    <Button
                        onClick={handleDeleteAccount}
                        size="lg"
                        isDisabled={confirmDelete !== user?.username}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-400 disabled:bg-zinc-700 disabled:text-zinc-400 transition px-5 py-3 rounded-xl font-medium cursor-pointer"
                        iconLeading={Trash2}
                    >
                        Delete Account
                    </Button>
                </section>
            </div>
        </main>
    );
}
