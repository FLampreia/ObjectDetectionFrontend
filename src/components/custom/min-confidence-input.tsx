import { Input } from "../base/input/input"
import { InputNumber } from "../base/input/input-number"

interface MinConfidenceInputProps {
    value: number
    onChange: (value: number) => void
}



export function MinConfidenceInput({
    value,
    onChange,
}: MinConfidenceInputProps) {

    return (

        <InputNumber
            isRequired
            orientation="horizontal"
            label="4. Minimum Confidence (%)"
            hint="0-100%"
            value={value}
            minValue={0}
            maxValue={100}
            onChange={(val: number) => {
                const clamped = Math.max(0, Math.min(100, val))
                onChange(clamped)
            }}
        />

    )
}