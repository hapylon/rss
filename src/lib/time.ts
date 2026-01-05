export function durationToMs(input: string): number {

    const regex = /(\d+)(ms|s|m|h)/g;
    const matches = input.matchAll(regex);
    try {

        const unitMap: Record<string, number> = {
            ms: 1,
            s: 1000,
            m: 60_000,
            h: 3_600_000,
        };

        let totalMs = 0;

        for (const match of matches) {
            const value = parseInt(match[1], 10);
            const unit = match[2];
            totalMs += value * (unitMap[unit] || 0);
        }

        return totalMs;
    } catch {
        throw new Error("Usage: <number><ms|s|m|h>")
    }
}