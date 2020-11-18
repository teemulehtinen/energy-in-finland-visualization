import { useRef } from "react"

const Year = ({data, frame, pause, setPause, setFilter}) => {
    
    const select = useRef()

    const year = data.length > 0 ? data[frame].values.date.getFullYear() : undefined
    const togglePause = () => setPause(!pause)
    const setFilterValue = () => setFilter(select.current.value)

    return (
        <div className="Year">
            <h1>{year}</h1>
            <button onClick={togglePause}>{pause ? '▶' : '■'}</button>
            <select ref={select} onChange={setFilterValue}>
                <option value="all">All</option>
                <option value="heating">Heating</option>
                <option value="electricity">Electricity</option>
                <option value="traffic">Traffic</option>
            </select>
        </div>
    )
}

export default Year
