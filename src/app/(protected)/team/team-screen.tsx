"use client"

import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group"
import { SearchSm, Folder, Users01 } from "@untitledui/icons"
import { useState } from "react"
import { MyTeamsSection } from "./my-teams-section"
import { ExploreTeamsSection } from "./explore-teams-section"
import { PageHeader } from "@/components/custom/layout/page-header";


export default function TeamScreen() {
    const [selectedTeamTab, setSelectedTeamTab] = useState("my-teams");


    return (

        <main className="flex-1 max-w-7xl mx-auto w-full flex-col justify-between">

            <PageHeader
                title="Teams"
                description="Collaborate with your teams and explore shared detections."
                icon={<Users01 />}
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
                    id="my-teams"
                    iconLeading={<Folder />}
                >
                    My Teams
                </ButtonGroupItem>

                <ButtonGroupItem
                    id="explore-teams"
                    iconLeading={<SearchSm />}
                >
                    Explore Teams
                </ButtonGroupItem>

            </ButtonGroup>


            <section >
                {selectedTeamTab === "my-teams" ? (
                    <MyTeamsSection />
                ) : (
                    <ExploreTeamsSection />
                )}
            </section>
        </main>


    )
}
