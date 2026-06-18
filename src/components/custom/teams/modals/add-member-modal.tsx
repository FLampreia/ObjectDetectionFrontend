"use client";

import { Modal, ModalOverlay, Dialog, DialogTrigger } from "@/components/application/modals/modal";
import { useMembers } from "@/hooks/use-members";
import { useState } from "react";
import { Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Heading } from "react-aria-components";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string | null;
};

export function AddMemberModal({ isOpen, onOpenChange, teamId }: Props) {
    const [error, setError] = useState<string | null>(null);
    const { addMember } = useMembers(teamId);
    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>

            <Button size="sm" iconLeading={<Plus />} className="max-md:hidden" >
                Add Member
            </Button>

            <Button aria-label="Create" size="sm" iconLeading={Plus} className="md:hidden" />

            <ModalOverlay>
                <Modal>
                    <Dialog className="p-6 w-105 space-y-4">

                        <Heading slot="title" className="text-xl font-semibold"> Add New Member</Heading>


                        <form
                            className="space-y-4"
                            onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                setError(null);

                                const form = e.currentTarget;
                                const formData = new FormData(form);
                                const email = formData.get("email") as string;

                                try {
                                    await addMember(email);

                                    form.reset();
                                    onOpenChange(false);
                                } catch (err: unknown) {
                                    setError(err instanceof Error ? err.message : "Unexpected Error");
                                }
                            }}
                        >
                            <Input
                                name="email"
                                type="email"
                                placeholder="Member email"
                                isInvalid={!!error}
                                hint={error ?? undefined}
                                onChange={() => setError(null)}
                            />

                            <div className="flex justify-end gap-2">
                                <Button color="secondary" size="md" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>

                                <Button type="submit" size="md">
                                    Add
                                </Button>
                            </div>
                        </form>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    )
}