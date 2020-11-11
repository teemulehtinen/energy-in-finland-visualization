import { area, axisBottom, axisLeft, max, scaleLinear, scaleOrdinal, scaleTime, select, stack } from "d3"
import { useCallback } from "react"

const Timeline = ({title, unit, data, years, keys, colors}) => {

    const d3ref = useCallback(node => {

        const margin = {top:10, right:30, bottom:30, left:60}

        const selectOrCreate = (selection, creator) => selection.empty() ? creator() : selection

        if (node !== null) {
            const width = node.offsetWidth - margin.left - margin.right
            const height = node.offsetHeight - margin.top - margin.bottom
            const palette = scaleOrdinal()
                .domain(keys)
                .range(keys.map(k => colors[k]))
            const series = stack()
                .keys(keys)
                (data)
            
            const svg = selectOrCreate(select(node).select('svg'), () => select(node).append('svg'))
                .attr('width', node.offsetWidth)
                .attr('height', node.offsetHeight)
            const wrap = selectOrCreate(svg.select('.wrap'), () => svg.append('g').attr('class', 'wrap'))
                .attr('transform', `translate(${margin.left},${margin.top})`)

            selectOrCreate(wrap.select('.title'), () => wrap.append('text').attr('class', 'title'))
                .text(title)
                .attr('font-family', 'sans-serif')
                .attr('font-size', 14)
                .attr('transform', `translate(8,${margin.top})`)

            selectOrCreate(wrap.select('.unit'), () => wrap.append('text').attr('class', 'unit'))
                .text(unit)
                .attr('font-family', 'sans-serif')
                .attr('font-size', 10)
                .attr('text-anchor', 'end')
                .attr('transform', `translate(-8,${margin.top})`)

            const x = scaleTime()
                .domain(years)
                .range([0, width])
            selectOrCreate(wrap.select('.xaxis'), () => wrap.append('g').attr('class', 'xaxis'))
                .attr('transform', `translate(0,${height})`)
                .call(axisBottom(x))

            const y = scaleLinear()
                .domain([0, max(series, (d) => max(d.map(p => p[1])))])
                .range([height, 0])
            selectOrCreate(wrap.select('.yaxis'), () => wrap.append('g').attr('class', 'yaxis'))
                .call(axisLeft(y))

            wrap.selectAll('.area')
                .data(series)
                .join('path')
                .attr('class', 'area')
                .style('fill', d => palette(d.key))
                .attr('d', area()
                    .x(d => x(d.data.date))
                    .y0(d => y(d[0]))
                    .y1(d => y(d[1]))
                )
        }
    }, [data, colors, keys])

    if (data.length === 0) {
        return (
            <p>Loading data...</p>
        )
    }
    return (
        <div className="Timeline" ref={d3ref}></div>
    )
}

export default Timeline
