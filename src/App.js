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
import TransparencyDialog from './components/TransparencyDialog'

const App = () => {

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
  const [dialog, setDialog] = useState(false)
  const [target, setTarget] = useState(0)

  useEffect(() => {
    csv('primaryenergy.csv', parseConsumptionRow).then(data => setRawConsumption(data))
    csv('energysectorco2.csv', parseEmissionsRow).then(data => setRawEmissions(data))
  }, [])

  useEffect(() => {
    if (rawConsumption.length > 0 && rawEmissions.length > 0) {
      const consumption = pickAndRank(rawConsumption, consumptionKeys[filter], interpolationSteps)
      const years = [rawConsumption[0].date.getFullYear(), rawEmissions[0].date.getFullYear()]
      const emissions = pickAndRank(emissionsZeroYears(years[0], years[1]).concat(rawEmissions), emissionsKeys[filter], interpolationSteps)
      const level90 = emissions.length > 0 ? Object.entries(emissions[90].values).filter(p => p[0] !== 'date').reduce((s, p) => s + p[1], 0) : 0
      setConsumption(consumption)
      setConsumptionColors(assignColors(consumptionKeys[filter]))
      setEmissions(emissions)
      setEmissionColors(assignColors(emissionsKeys[filter]))
      setTarget(0.4 * level90)
    }
  }, [rawConsumption, rawEmissions, filter])

  const toggleDialog = ({target}) => {
    setDialog(!dialog)
    target.blur()
  }

  return (
    <div style={{position: 'relative', minHeight: '100%'}}>
      <div className="App">
        <div className="left column">
          <h1>Energy consumption by source</h1>
          <BarChartRace data={consumption} frame={frame} setFrame={setFrame} pause={pause} names={names} colors={consumptionColors}></BarChartRace>
          <Timeline unit="TJ" data={consumption} frame={frame} setFrame={setFrame} keys={consumptionKeys[filter]} colors={consumptionColors}></Timeline>
        </div>
        <div className="right column">
          <h1>Energy sector carbon dioxide emissions</h1>
          <BarChartRace data={emissions} frame={frame} setFrame={setFrame} pause={pause} names={names} colors={emissionColors} reverse={true}></BarChartRace>
          <Timeline unit="10⁹ CO₂" data={emissions} frame={frame} setFrame={setFrame} keys={emissionsKeys[filter]} colors={emissionColors} target={target}></Timeline>
        </div>
        <div className="center">
          <Year data={consumption} frame={frame} pause={pause} setPause={setPause} setFilter={setFilter}></Year>
          {filter === 'heating' &&
            <p>Includes combined electricity production.</p>
          }
          {filter === 'electricity' &&
            <p>Excludes electricity from combined heat production.</p>
          }
          <div className="red-level">Rough target<br />level at 2030</div>
        </div>
      </div>
      <footer>
        <button className="transparency" title="Transparency Badge" onClick={toggleDialog}>🕵️ data transparency statement</button>
        &nbsp;| <a href="https://creativecommons.org/licenses/by/4.0/">content license CC BY 4.0</a>
        &nbsp;| <a href="https://github.com/teemulehtinen/energy-in-finland-visualization">open source MIT at GitHub</a>
      </footer>
      <TransparencyDialog show={dialog} hide={() => setDialog(false)}></TransparencyDialog>
    </div>
  )
}

export default App
