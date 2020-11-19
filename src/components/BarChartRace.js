import { easeLinear, format, interpolateNumber, max, range, scaleBand, scaleLinear, select } from "d3"
import { useEffect, useRef } from "react"

const BarChartRace = ({data, frame, setFrame, pause, names, colors, reverse}) => {
    const barCount = 8
    const frameDuration = 250

    const ref = useRef()

    useEffect(() => {
        if (data.length === 0) {
            return
        }
        const width = ref.current.clientWidth
        const height = ref.current.clientHeight
        const lastFrame = data.length - 1
        const svg = select(ref.current)

        const x = scaleLinear()
            .domain([0, max(data, (d) => max(d.rank.map(([_, value]) => value)))])
            .range(reverse ? [width, 0] : [0, width])

        const y = scaleBand()
            .domain(range(barCount))
            .range([0, height])
            .padding(0.1)

        const transition = svg.transition()
            .duration(frameDuration)
            .ease(easeLinear)

        const barHeight = y.bandwidth()
        const textPad = 0.4 * barHeight
        const texty = (y) => y + textPad
        const textx = (x) => reverse ? x - textPad / 4 : x + textPad / 4
        const previousValue = (key, _) => frame > 0 ? data[frame - 1].values[key] || 0 : 0
        const nextValue = (key, _) => frame < lastFrame ? data[frame + 1].values[key] || 0 : 0
        const barx = reverse ? v => x(v) : _ => x(0)
        const barw = reverse ? v => Math.max(x(0) - x(v), 0) : v => Math.max(x(v) - x(0), 0)

        const formatNumber = format(',d')
        const textTween = (a, b) => {
            const i = interpolateNumber(a, b);
            return function (t) { this.textContent = formatNumber(i(t)) }
        }

        svg.selectAll('.bar')
            .data(data[frame].rank.slice(0, barCount), ([key, _]) => key)
            .join(
                enter => enter.append('rect')
                    .attr('fill', ([key, _]) => colors[key])
                    .attr('class', 'bar')
                    .attr('x', ([key, value]) => barx(previousValue(key, value)))
                    .attr('y', _ => height)
                    .attr('width', ([key, value]) => barw(previousValue(key, value)))
                    .attr('height', barHeight),
                update => update,
                exit => exit.call(bar => bar.transition(transition)
                    .attr('x', ([key, value]) => barx(nextValue(key, value)))
                    .attr('y', _ => height)
                    .attr('width', ([key, value]) => barw(nextValue(key, value)))
                    .remove()
                )
            )
            .call(bar => bar.transition(transition)
                .attr('x', ([_, value]) => barx(value))
                .attr('y', (_, i) => y(i))
                .attr('width', ([_, value]) => barw(value))
            )

        svg.selectAll('.label')
            .data(data[frame].rank.slice(0, barCount), ([key, _]) => key)
            .join(
                enter => enter.append('text')
                    .attr('class', 'label')
                    .attr('text-anchor', reverse === true ? 'end' : 'start')
                    .text(([key, _]) => names[key])
                    .attr('x', textx(x(0)))
                    .attr('y', _ => texty(height))
                    .call(text => text.append("tspan")
                        .attr('x', textx(x(0)))
                        .attr('dy', '1.15em')
                    ),
                update => update,
                exit => exit.call(text => text.transition(transition)
                    .attr('y', _ => texty(height))
                    .remove()
                    .call(g => g.select("tspan").tween("text", ([key, value]) => textTween((previousValue(key, value), value))))
                )
            )
            .call(text => text.transition(transition)
                .attr('y', (_, i) => texty(y(i)))
                .call(g => g.select("tspan").tween("text", ([key, value]) => textTween(previousValue(key, value), value)))
            )

        if (!pause && frame < lastFrame) {
            transition.on('end', () => setFrame(frame + 1))
        }
    }, [data, frame, setFrame, pause, names, colors, reverse])

    return (
        <div className="BarChartRace">
            <svg ref={ref}></svg>
        </div>
    )
}

export default BarChartRace
