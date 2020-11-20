import { csv } from 'd3'
import { useEffect, useState } from 'react'
import './App.css'
import { parseConsumptionRow, consumptionKeys } from './data/consumption'
import { parseEmissionsRow, emissionsKeys, emissionsZeroYears } from './data/emissions'
import { pickAndRank } from './data/rank'
import { assignColors } from './data/colors'
import { names } from './data/names'
import Year from './components/Year'
import Timeline from './components/Timeline'
import BarChartRace from './components/BarChartRace'

const App = () => {

    const target2030 = 0.4 * 52.6

    const interpolationSteps = 3

    const [rawConsumption, setRawConsumption] = useState([])
    const [rawEmissions, setRawEmissions] = useState([])
    const [consumption, setConsumption] = useState([])
    const [emissions, setEmissions] = useState([])
    const [consumptionColors, setConsumptionColors] = useState({})
    const [emissionColors, setEmissionColors] = useState({})
    const [frame, setFrame] = useState(0)
    const [pause, setPause] = useState(false)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        csv('primaryenergy.csv', parseConsumptionRow).then(data => setRawConsumption(data))
        csv('energysectorco2.csv', parseEmissionsRow).then(data => setRawEmissions(data))
    }, [])

    useEffect(() => {
        if (rawConsumption.length > 0 && rawEmissions.length > 0) {
            setConsumption(pickAndRank(rawConsumption, consumptionKeys[filter], interpolationSteps))
            const years = [rawConsumption[0].date.getFullYear(), rawEmissions[0].date.getFullYear()]
            setEmissions(pickAndRank(emissionsZeroYears(years[0], years[1]).concat(rawEmissions), emissionsKeys[filter], interpolationSteps))
            setConsumptionColors(assignColors(consumptionKeys[filter]))
            setEmissionColors(assignColors(emissionsKeys[filter]))
        }
    }, [rawConsumption, rawEmissions, filter])

    return (
        <div className="App">
            <div className="left column">
                <h1>Energy consumption by source</h1>
                <BarChartRace data={consumption} frame={frame} setFrame={setFrame} pause={pause} names={names} colors={consumptionColors}></BarChartRace>
                <Timeline unit="TJ" data={consumption} frame={frame} setFrame={setFrame} keys={consumptionKeys[filter]} colors={consumptionColors}></Timeline>
            </div>
            <div className="right column">
                <h1>Energy sector carbon dioxide emissions</h1>
                <BarChartRace data={emissions} frame={frame} setFrame={setFrame} pause={pause} names={names} colors={emissionColors} reverse={true}></BarChartRace>
                <Timeline unit="10⁹ CO₂" data={emissions} frame={frame} setFrame={setFrame} keys={emissionsKeys[filter]} colors={emissionColors} target={target2030}></Timeline>
            </div>
            <div className="center">
                <Year data={consumption} frame={frame} pause={pause} setPause={setPause} setFilter={setFilter}></Year>
                {filter === 'heating' &&
                    <p>Includes combined electricity production.</p>
                }
                {filter === 'electricity' &&
                    <p>Excludes electricity from combined heat production.</p>
                }
            </div>
            <button className="transparency" title="Transparency Badge">🕵️</button>
        </div>
    )
}

export default App
