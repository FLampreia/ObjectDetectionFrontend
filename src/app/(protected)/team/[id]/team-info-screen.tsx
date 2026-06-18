
"use client";

import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { TeamMembersSection } from "./team-members-section";
import { use, useState } from "react";
import { Camera, Users } from "lucide-react";
import NotFound from "@/app/not-found";
import { TeamDetectionsSection } from "./team-detections-section";


interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function TeamInfoScreen({ params }: PageProps) {
    const { id } = use(params);
    const [selectedTeamTab, setSelectedTeamTab] = useState("team-members");

    return (
        <main className="flex-1 max-w-6xl mx-auto w-full flex-col justify-between">
            <h1 className="text-3xl font-bold mb-8 pt-8">Teams</h1>

            <ButtonGroup
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

                <ButtonGroupItem
                    id="team-detections"
                    iconLeading={<Camera />}
                >
                    Team Detections
                </ButtonGroupItem>

            </ButtonGroup>


            <section >

                {selectedTeamTab === "team-members" ? (
                    <TeamMembersSection teamId={id} />
                ) : (
                    <TeamDetectionsSection />
                )}
                
            </section>
        </main>
    );
}