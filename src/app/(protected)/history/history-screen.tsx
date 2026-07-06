"use client"

import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group"
import { Button } from "@/components/base/buttons/button"
import { InputDate } from "@/components/base/input/input-date"

export default function HistoryScreen() {
    return (
        <main className="flex-1 max-w-6xl mx-auto w-full flex-col justify-between">

            <h1 className="text-3xl font-bold mb-8 pt-8">History</h1>

            <div className="grid grid-cols-1 xl:grid-cols-[auto_auto_auto] gap-4 items-end mb-4">
                {/* Grupo de botões */}
                <ButtonGroup>
                    <ButtonGroupItem>
                        All
                    </ButtonGroupItem>

                    <ButtonGroupItem>
                        Today
                    </ButtonGroupItem>

                    <ButtonGroupItem>
                        Last Week
                    </ButtonGroupItem>
                </ButtonGroup>


                {/* Datas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputDate label="Start Date" />

                    <InputDate label="Finish Date" />
                </div>


                {/* Ações */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                        color="secondary"
                        size="md"
                    >
                        Clear Filters
                    </Button>

                    <Button
                        size="md"
                    >
                        Extract Report
                    </Button>
                </div>

            </div>

            <section className="p-6 bg-primary pt-4 shadow-xs ring-secondary ring-inset lg:rounded-xl lg:ring-1">

            </section>

        </main>
    )
}