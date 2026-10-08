"use client";

import { useRef, useState, type FormEvent } from "react";
import { Lock, Save, Settings, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";
import { InlineFeedback } from "@/components/custom/layout/inline-feedback";
import { PageHeader } from "@/components/custom/layout/page-header";
import { SectionCard } from "@/components/custom/layout/section-card";
import { useAuth } from "@/hooks/use-auth";
import { updateUsername, updateFullName, updatePassword, deletePassword } from "@/services/user";

type Action = "profile" | "password" | "delete";
type Feedback = { tone: "error" | "success"; message: string };

export default function SettingsScreen() {
    const { user, refreshUser, logout } = useAuth();
    const router = useRouter();
    const pendingRef = useRef(false);
    const [pending, setPending] = useState<Action | null>(null);
    const [feedback, setFeedback] = useState<Partial<Record<Action, Feedback>>>({});
    const [username, setUsername] = useState(() => user?.username ?? "");
    const [fullName, setFullName] = useState(() => user?.full_name ?? "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmDelete, setConfirmDelete] = useState("");
    const isBusy = pending !== null;

    async function perform(action: Action, operation: () => Promise<void>, successMessage?: string) {
        if (pendingRef.current || !user?.id) return;
        pendingRef.current = true;
        setPending(action);
        setFeedback((previous) => ({ ...previous, [action]: undefined }));
        try {
            await operation();
            if (successMessage) {
                setFeedback((previous) => ({ ...previous, [action]: { tone: "success", message: successMessage } }));
            }
        } catch (error: unknown) {
            setFeedback((previous) => ({
                ...previous,
                [action]: { tone: "error", message: error instanceof Error ? error.message : "Unable to save changes. Please try again." },
            }));
        } finally {
            pendingRef.current = false;
            setPending(null);
        }
    }

    function handleProfileSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user?.id) return;
        void perform("profile", async () => {
            if (username !== user.username) await updateUsername(user.id, username);
            if (fullName !== user.full_name) await updateFullName(user.id, fullName);
            await refreshUser();
        }, "Your profile has been updated.");
    }

    function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user?.id) return;
        if (newPassword !== confirmPassword) {
            setFeedback((previous) => ({ ...previous, password: { tone: "error", message: "Passwords do not match." } }));
            return;
        }
        void perform("password", async () => {
            await updatePassword(user.id, newPassword, currentPassword);
            await refreshUser();
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }, "Your password has been updated.");
    }

    function handleDeleteAccount(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user?.id || confirmDelete !== user.username) return;
        void perform("delete", async () => {
            await deletePassword(user.id);
            logout();
            router.replace("/");
        });
    }

    function renderFeedback(action: Action) {
        const result = feedback[action];
        return result ? <InlineFeedback tone={result.tone}>{result.message}</InlineFeedback> : null;
    }

    return (
        <main className="mx-auto w-full max-w-7xl flex-1">
            <PageHeader title="Settings" description="Manage your profile, password and account preferences." icon={<Settings />} />

            <div className="grid gap-6 pb-8 lg:grid-cols-2">
                <SectionCard title="Personal information" description="Update the details shown on your profile." icon={<User />} className="flex flex-col" contentClassName="flex flex-1 flex-col">
                    <form onSubmit={handleProfileSave} aria-busy={pending === "profile"} className="flex flex-1 flex-col gap-5">
                        <Input label="Username" autoComplete="username" value={username} onChange={setUsername} isRequired isDisabled={isBusy} />
                        <Input label="Full name" autoComplete="name" value={fullName} onChange={setFullName} isRequired isDisabled={isBusy} />
                        <Input label="Email address" type="email" value={user?.email ?? ""} hint="Your email address cannot be changed here." isDisabled />
                        {renderFeedback("profile")}
                        <div className="mt-auto flex justify-end border-t border-secondary pt-5">
                            <Button type="submit" size="md" iconLeading={Save} isDisabled={isBusy} isLoading={pending === "profile"} showTextWhileLoading>
                                {pending === "profile" ? "Saving…" : "Save changes"}
                            </Button>
                        </div>
                    </form>
                </SectionCard>

                <SectionCard title="Password & security" description="Choose a new password to protect your account." icon={<Lock />} className="flex flex-col" contentClassName="flex flex-1 flex-col">
                    <form onSubmit={handlePasswordChange} aria-busy={pending === "password"} className="flex flex-1 flex-col gap-5">
                        <Input label="Current password" type="password" autoComplete="current-password" value={currentPassword} onChange={setCurrentPassword} isRequired isDisabled={isBusy} />
                        <Input label="New password" type="password" autoComplete="new-password" value={newPassword} onChange={setNewPassword} isRequired isDisabled={isBusy} />
                        <Input label="Confirm new password" type="password" autoComplete="new-password" value={confirmPassword} onChange={setConfirmPassword} isRequired isDisabled={isBusy} />
                        {renderFeedback("password")}
                        <div className="mt-auto flex justify-end border-t border-secondary pt-5">
                            <Button type="submit" size="md" iconLeading={Save} isDisabled={isBusy} isLoading={pending === "password"} showTextWhileLoading>
                                {pending === "password" ? "Updating…" : "Update password"}
                            </Button>
                        </div>
                    </form>
                </SectionCard>

                <div className="lg:col-span-2">
                    <SectionCard title="Delete account" description="Permanently delete your account. This action cannot be undone." icon={<Trash2 />} destructive>
                        <form onSubmit={handleDeleteAccount} aria-busy={pending === "delete"} className="space-y-4">
                            <div>
                                <Input
                                    label="Confirm your username"
                                    hint={`Type ${user?.username ?? "your username"} to confirm account deletion.`}
                                    value={confirmDelete}
                                    onChange={setConfirmDelete}
                                    autoComplete="off"
                                    isRequired
                                    isDisabled={isBusy}
                                />
                            </div>
                            {renderFeedback("delete")}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    size="md"
                                    color="primary-destructive"
                                    iconLeading={Trash2}
                                    isDisabled={isBusy || !user?.username || confirmDelete !== user.username}
                                    isLoading={pending === "delete"}
                                    showTextWhileLoading
                                >
                                    {pending === "delete" ? "Deleting…" : "Delete account"}
                                </Button>
                            </div>
                        </form>
                    </SectionCard>
                </div>
            </div>
        </main>
    );
}
