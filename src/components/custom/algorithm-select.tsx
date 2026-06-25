import { Select } from "../base/select/select"
import { AlgorithmObj } from "@/types"

export function AlgorithmSelect({
    algorithms,
    selectedAlgorithm,
    onAlgorithmChange,
}: {
    algorithms: AlgorithmObj[]
    selectedAlgorithm: string | null
    onAlgorithmChange: (value: string) => void
}) {
    const algorithmItems = algorithms.map((algorithm) => ({
        id: algorithm.name,
        label: algorithm.name,
    }))

    return (
        <Select
            size="md"
            label="5. Select the Algorithm"
            tooltip="Select the algorithm to process your upload"
            placeholder="Select an algorithm"
            items={algorithmItems}
            value={selectedAlgorithm ?? undefined}
            onChange={(key) => onAlgorithmChange(String(key))}
        >
            {(algorithm) => (
                <Select.Item id={algorithm.id}>
                    {algorithm.label}
                </Select.Item>
            )}
        </Select>
    )
}