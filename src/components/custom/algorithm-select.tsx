import { CheckCircle2, Download, Loader2 } from "lucide-react"
import { Select } from "../base/select/select"
import { AlgorithmObj } from "@/types"
import { useAlgorithms } from "@/hooks/use-algorithms"

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
        installed: algorithm.installed,
    }))

    const algorithmById = Object.fromEntries(
        algorithms.map(a => [a.name, a])
    )

    const safeSelectedAlgorithm =
        selectedAlgorithm &&
            algorithmById[selectedAlgorithm]?.installed
            ? selectedAlgorithm
            : undefined

    const {
        downloadAlgorithm,
        downloadingAlgorithm,
        isDownloading,
    } = useAlgorithms()



    return (
        <Select
            isRequired
            size="md"
            label="5. Select the Algorithm"
            tooltip="Select the algorithm to process your upload"
            placeholder="Select an algorithm"
            items={algorithmItems}
            value={safeSelectedAlgorithm}
            onChange={(key) => {
                const id = String(key)
                const algorithm = algorithmById[id]

                if (!algorithm?.installed) {
                    return
                }

                onAlgorithmChange(id)
            }}
        >
            {(item) => {
                const algorithm = algorithmById[item.id]

                return (
                    <Select.Item
                        id={item.id}
                        textValue={item.label}
                        isDisabled={!algorithm?.installed}
                    >
                        <div className="flex items-center w-full gap-2">

                            <div className="flex items-center shrink-0">
                                {algorithm?.installed ? (
                                    <CheckCircle2 size={16} className="text-green-500" />
                                ) : (
                                    <button
                                        title="Download"
                                        disabled={isDownloading}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()

                                            if (!isDownloading) {
                                                downloadAlgorithm(String(item.id))
                                            }
                                        }}
                                        className="text-blue-500 hover:text-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {downloadingAlgorithm === String(item.id) ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Download size={16} />
                                        )}
                                    </button>
                                )}
                            </div>

                            <span className="truncate flex-1">
                                {item.label}
                            </span>

                        </div>
                    </Select.Item>
                )
            }}
        </Select>
    )
}