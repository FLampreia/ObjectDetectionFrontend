/** Prepare one frame ahead while keeping detection requests strictly ordered. */
export async function processVideoFrames<T>(
    frameCount: number,
    prepare: (index: number) => Promise<T>,
    process: (frame: T, index: number) => Promise<void>,
    shouldStop: () => boolean = () => false,
): Promise<void> {

    if (frameCount === 0 || shouldStop()) return

    let frame: T = await prepare(0)

    for (let index = 0; index < frameCount; index++) {
        if (shouldStop()) return

        // Attach rejection handlers immediately and drain both tasks before cleanup.
        const results = await Promise.allSettled([
            process(frame, index),
            index + 1 < frameCount && !shouldStop() ? prepare(index + 1) : Promise.resolve(null),
        ])

        if (results[0].status === "rejected") throw results[0].reason
        if (results[1].status === "rejected") throw results[1].reason
        // Drain the submitted frame and any preparation before allowing finalization.
        if (shouldStop()) return
        if (index + 1 < frameCount) frame = results[1].value as T
    }
}
