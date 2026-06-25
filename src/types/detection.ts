
export type Detection = {
    class_id: number
    class_name: string
    confidence: number
    bbox: [number, number, number, number]

}

export type Area = {
    x1: number
    y1: number
    x2: number
    y2: number
}

export type AlgorithmObj = {
    name: string
    installed: boolean
}