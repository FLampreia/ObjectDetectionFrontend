"use client"

import { TopObject } from "@/types";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Props = {
    top_objetcs?: TopObject[];
};

export default function TopObjectsChart({
    top_objetcs
}: Props) {
    const hasData = top_objetcs && top_objetcs.length > 0;


    return (
        <div className="flex h-full min-w-0 flex-col rounded-lg border border-secondary bg-primary p-4">
            <h3 className="text-sm font-semibold text-primary">
                Top Detected Objects
            </h3>

            <p className="mt-1 text-sm text-tertiary">
                Most frequently detected object classes
            </p>

            {hasData ? (
                <div className="mt-5 h-72 min-h-72 min-w-0 flex-1">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={top_objetcs ?? []}
                            layout="vertical"
                            margin={{
                                top: 0,
                                right: 20,
                                left: 20,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid
                                horizontal={false}
                                stroke="currentColor"
                                strokeOpacity={0.1}
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                type="number"
                                allowDecimals={false}
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "currentColor",
                                    fontSize: 12,
                                }}
                            />

                            <YAxis
                                type="category"
                                dataKey="name"
                                width={80}
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "currentColor",
                                    fontSize: 12,
                                }}
                            />

                            <Tooltip
                                cursor={{
                                    fill: "currentColor",
                                    opacity: 0.05,
                                }}
                                contentStyle={{
                                    backgroundColor:
                                        "var(--background-color-primary)",
                                    border:
                                        "1px solid var(--color-secondary)",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{
                                    color: "var(--color-primary)",
                                }}
                            />

                            <Bar
                                dataKey="count"
                                name="Detections"
                                fill="currentColor"
                                radius={[0, 4, 4, 0]}
                                activeBar={{
                                    fill: "var(--color-bg-brand-solid)",
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>

                </div>

            ) : (
                <div className="mt-5 flex h-72 min-h-72 flex-1 items-center justify-center">
                    <p className="text-sm text-tertiary">
                        No detections
                    </p>
                </div>
            )}
        </div>
    )
}
