"use client";

import { Modal, ModalOverlay, Dialog, DialogTrigger } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { useState } from "react";
import { Plus } from "@untitledui/icons";
import { useTeams } from "@/hooks/use-team";
import { Heading } from "react-aria-components";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CreateTeamModal({ isOpen, onOpenChange }: Props) {
    const [error, setError] = useState<string | null>(null);
    const { createTeam } = useTeams();
    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>

            <Button size="sm" iconLeading={<Plus />} className="max-md:hidden" >
                Create Team
            </Button>

            <Button aria-label="Create" size="sm" iconLeading={Plus} className="md:hidden" />

            <ModalOverlay>
                <Modal>
                    <Dialog className="p-6 w-105 space-y-4">

                        <Heading slot="title" className="text-xl font-semibold"> Create Team</Heading>


                        <form
                            className="space-y-4"
                            onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                setError(null);

                                const form = e.currentTarget;
                                const formData = new FormData(form);
                                const name = formData.get("name") as string;

                                try {
                                    await createTeam(name);

                                    form.reset();
                                    onOpenChange(false);
                                } catch (err: unknown) {
                                    setError(err instanceof Error ? err.message : "Unexpected Error");
                                }
                            }}
                        >
                            <Input
                                name="name"
                                placeholder="Team name"
                                isInvalid={!!error}
                                hint={error ?? undefined}
                                onChange={() => setError(null)}
                            />

                            <div className="flex justify-end gap-2">
                                <Button color="secondary" size="md" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>

                                <Button type="submit" size="md">
                                    Create
                                </Button>
                            </div>
                        </form>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
}