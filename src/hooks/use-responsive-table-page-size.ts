"use client"

import { useEffect, useState } from "react"

export function useResponsiveTablePageSize() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    useEffect(() => {
        if (!container) return
        const desktop = window.matchMedia("(min-width: 1024px)")
        let frame = 0
        const measure = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                // Stacked layouts have automatic height, so keep their compact page size.
                if (!desktop.matches) {
                    setItemsPerPage(5)
                    return
                }
                const header = container.querySelector("thead")
                const row = container.querySelector("tbody tr:has(td)")
                if (!row || container.clientHeight === 0) return
                const rowHeight = row.getBoundingClientRect().height
                if (rowHeight === 0) return
                const availableHeight = container.clientHeight - (header?.getBoundingClientRect().height ?? 0) - 2
                setItemsPerPage(Math.max(1, Math.min(10, Math.floor(availableHeight / rowHeight))))
            })
        }
        const resizeObserver = new ResizeObserver(measure)
        resizeObserver.observe(container)
        // Measure again when loading completes or the Objects/Passages table changes.
        const mutationObserver = new MutationObserver(measure)
        mutationObserver.observe(container, { childList: true, subtree: true })
        desktop.addEventListener("change", measure)
        measure()
        return () => {
            cancelAnimationFrame(frame)
            resizeObserver.disconnect()
            mutationObserver.disconnect()
            desktop.removeEventListener("change", measure)
        }
    }, [container])

    return { tableContainerRef: setContainer, itemsPerPage }
}
