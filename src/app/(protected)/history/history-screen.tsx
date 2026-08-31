"use client"

import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group"
import { Button } from "@/components/base/buttons/button"
import { InputDate } from "@/components/base/input/input-date"
import { getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";
import { DateValue, Key } from "react-aria-components";
import { AllDetectionsSection } from "./all-detections-section";


export default function HistoryScreen() {

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full flex-col justify-between">

            <h1 className="text-3xl font-bold mb-8 pt-8">History</h1>

            <section>
                <AllDetectionsSection/>
            </section>

        </main>
    )
}