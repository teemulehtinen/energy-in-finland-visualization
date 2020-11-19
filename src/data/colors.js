import { interpolateBuPu } from "d3"

export const assignColors = (keys) => {
    const colors = {}
    for (let i = 0; i < keys.length; i++) {
        colors[keys[i]] = interpolateBuPu(0.44 - 0.4 * i / keys.length)
    }
    return colors
}
