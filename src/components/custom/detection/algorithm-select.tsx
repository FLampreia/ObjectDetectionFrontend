import { CheckCircle2, Download, Loader2 } from "lucide-react"
import { Select } from "../../base/select/select"
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
            : null

    const {
        downloadAlgorithm,
        downloadingAlgorithm,
        isDownloading,
    } = useAlgorithms()



    return (
        <Select
            isRequired
            size="md"
            label="2. Select the Model"
            tooltip="Select the model to process your upload"
            placeholder="Select a model"
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
                                    <CheckCircle2 size={16} className="text-success-primary" />
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
                                        className="cursor-pointer rounded-md text-brand-secondary outline-focus-ring hover:text-brand-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
