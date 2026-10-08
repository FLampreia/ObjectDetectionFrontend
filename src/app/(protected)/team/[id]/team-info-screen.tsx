
"use client";

import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { TeamMembersSection } from "./team-members-section";
import { use, useState } from "react";
import { Camera, Users } from "lucide-react";
import { TeamDetectionsSection } from "./team-detections-section";
import { useMembers } from "@/hooks/use-members";
import { PageHeader } from "@/components/custom/layout/page-header";


interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function TeamInfoScreen({ params }: PageProps) {
    const { id } = use(params);
    const [selectedTeamTab, setSelectedTeamTab] = useState("team-members");

    const { isMember } = useMembers(id);


    return (
        <main className="flex-1 max-w-7xl mx-auto w-full flex-col justify-between">
            <PageHeader
                title="Team overview"
                description="View team members and explore shared detection results."
                icon={<Users />}
            />

            <ButtonGroup
                disallowEmptySelection
                selectedKeys={[selectedTeamTab]}
                onSelectionChange={(keys) =>
                    setSelectedTeamTab(Array.from(keys)[0] as string)
                }
                className="pb-4"
            >
                <ButtonGroupItem
                    id="team-members"
                    iconLeading={<Users />}
                >
                    Team Members
                </ButtonGroupItem>

                {isMember && (
                    <ButtonGroupItem
                        id="team-detections"
                        iconLeading={<Camera />}
                    >
                        Team Detections
                    </ButtonGroupItem>
                )}



            </ButtonGroup>


            <section >

                {selectedTeamTab === "team-members" ? (
                    <TeamMembersSection teamId={id} />
                ) : isMember ? (
                    <TeamDetectionsSection teamId={id} />
                ) : null}

            </section>
        </main>
    );
}
