"use client"

import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group"
import { Input } from "@/components/base/input/input"
import { Plus, SearchSm, Folder } from "@untitledui/icons"
import { useState } from "react"
import { MyTeamsSection } from "./my-teams-section"
import { ExploreTeamsSection } from "./explore-teams-section"
import NotFound from "@/app/not-found"


export default function TeamScreen() {
    const [selectedTeamTab, setSelectedTeamTab] = useState("my-teams");


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