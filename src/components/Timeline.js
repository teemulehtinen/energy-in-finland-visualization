import { area, axisBottom, axisLeft, easeLinear, extent, max, pointer, scaleLinear, scaleOrdinal, scaleTime, select, stack } from "d3"
import { useEffect, useRef } from "react"

const Timeline = ({unit, data, frame, setFrame, keys, colors}) => {
    const frameDuration = 250

    const ref = useRef()

    useEffect(() => {
        if (data.length === 0) {
            return
        }
        const width = ref.current.clientWidth - 60 - 10
        const height = ref.current.clientHeight - 10 - 30
        const wrap = select(ref.current).select('.wrap')

        const series = stack().keys(keys)(data.map(d => d.values))

        const x = scaleTime()
            .domain(extent(data.map(d => d.values.date)))
            .range([0, width])

        const y = scaleLinear()
            .domain([0, max(series, (d) => max(d.map(p => p[1])))])
            .range([height, 0])

        wrap.select('.xaxis').call(axisBottom(x))
        wrap.select('.yaxis').call(axisLeft(y))
        wrap.select('.fills').selectAll('.area')
            .data(series)
            .join('path')
            .attr('class', 'area')
            .style('fill', d => colors[d.key])
            .attr('d', area()
                .x(d => x(d.data.date))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]))
            )

        wrap.select('.year').call(year => year.transition()
            .duration(frameDuration)
            .ease(easeLinear)
            .attr('x', x(data[frame].values.date))
        )

        wrap.on('mousedown', (event) => {
            event.preventDefault()
            select(window)
                .on('mousemove', (event) => {
                    const rect = select(ref.current).node().getBoundingClientRect()
                    const p = Math.max(Math.min(pointer(event)[0] - rect.x - 60, width - 1), 0)
                    setFrame(Math.floor(p / width * data.length))
                })
                .on('mouseup', () => {
                    select(window)
                        .on('mousemove', null)
                        .on('mouseup', null)
                })
        })

    }, [data, frame, setFrame, colors])

    return (
        <div className="Timeline">
            <svg ref={ref}>
                <g className="wrap">
                    <text className="unit">{unit}</text>
                    <g className="xaxis"></g>
                    <g className="yaxis"></g>
                    <g className="fills"></g>
                    <rect className="year"></rect>
                </g>
            </svg>
        </div>
    )
}

export default Timeline
