import { pairs } from "d3"

const createDate = (keys, at, a, bt, b) => {
    const ip = (key, value, next) => at * value + bt * next[key]
    const entries = Object.entries(a)
        .filter(([key, _]) => key === 'date' || keys.includes(key))
        .map(([key, value]) => [key, key === 'date' ? new Date(ip(key, value, b)) : ip(key, value, b)])
    return {
        values: Object.fromEntries(entries),
        rank: entries.filter(([key, value]) => key !== 'date' && value > 0).sort((a, b) => b[1] - a[1])
    }
}

export const pickAndRank = (data, keys, interpolationSteps) => {
    const frames = []
    for (const [a,b] of pairs(data)) {
        for (let i = 0; i < interpolationSteps; ++i) {
            const bt = i / interpolationSteps
            const at = 1 - bt
            frames.push(createDate(keys, at, a, bt, b))
        }
    }
    frames.push(createDate(keys, 0, data[data.length - 2], 1, data[data.length - 1]))
    return frames
}
