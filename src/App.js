import { csv } from 'd3'
import Timeline from './components/Timeline'
import './App.css'
import { useEffect, useState } from 'react'

const App = () => {

  const years = [new Date(1960, 0, 1), new Date(2018, 0, 1)]

  const volumeKeys = ['oils','coal','naturalgas'/*,'industryreactions'*/,'peat','wood','nuclear','hydro','wind','heatpumps','electricityimport','other']
  const emissionKeys = ['heavyoil','lightoil','transportoil','coal','naturalgas','peat','otherfossil','wood','otherbio']
  const colors = {
    oils: '#124E54',
    heavyoil: '#124E54',
    lightoil: '#00868B',
    transportoil: '#208E97',
    coal: '#333333',
    naturalgas: '#75B5BE',
    industryreactions: '#517071',
    peat: '#888888',
    otherfossil: '#ADADAD',
    wood: '#6ED65C',
    otherbio: '#C5EFBE',
    nuclear: '#EAD977',
    hydro: '#73D7FF',
    wind: '#C4EEFF',
    heatpumps: '#C4FFF3',
    electricityimport: '#BAD1FF',
    other: '#EEEEEE'
  }
  const names = {
    oils: 'Oil',
    heavyoil: 'Heavy fuel oil',
    lightoil: 'Light fuel oil',
    transportoil: 'Transport fuels',
    coal: 'Coal',
    naturalgas: 'Natural gas',
    industryreactions: 'Industry reactions',
    peat: 'Peat',
    otherfossil: 'Other fossil fuels',
    wood: 'Wood',
    otherbio: 'Other non-fossil fuels',
    nuclear: 'Nuclear energy',
    hydro: 'Hydro power',
    wind: 'Wind power',
    heatpumps: 'Heat pumps',
    electricityimport: 'Electricity import',
    other: 'Recycled sources',
    gasoline: 'Gasoline',
    biogasoline: 'Gasoline bio component',
    diesel: 'Diesel',
    biodiesel: 'Biodiesel',
    lpg: 'Propane',
    otheroils: 'Other oils',
    woodsmall: 'Wood small-scale',
    woodindustry: 'Wood industrial',
    recoveredfossil: 'Fossil waste',
    recoveredbio: 'Non-fossil waste',
    biogas: 'Biogas',
    solar: 'Solar energy',
    hydrogen: 'Hydrogen'
  }

  const [volumes, setVolumes] = useState([])
  const [emissions, setEmissions] = useState([])

  useEffect(() => {
    
    csv('primaryenergy.csv', d => ({
      date: new Date(+d.year, 0, 1),
      oils: +d.oilstotal,
      coal: +d.coaltotal,
      naturalgas: +d.naturalgas,
      nuclear: +d.nuclearenergy,
      hydro: +d.hydropower,
      wind: +d.windpower,
      wood: +d.woodtotal,
      peat: +d.peat,
      heatpumps: +d.heatpumps,
      other: +d.recoveredrecycledtotal,
      industryreactions: +d.industryreactions,
      electricityimport: +d.electricityimport,
      details: {
        gasoline: +d.gasoline,
        biogasoline: +d.biogasoline,
        diesel: +d.diesel,
        biodiesel: +d.biodiesel,
        lpg: +d.lpg,
        lightoil: +d.lightfueloil,
        heavyoil: +d.heavyfueloil,
        otheroils: (+d.otheroils) + (+d.biofueloil) + (+d.recycledoil) + (+d.refinerygas),
        coal: +d.coaltotal,
        naturalgas: +d.naturalgas,
        nuclear: +d.nuclearenergy,
        hydro: +d.hydropower,
        wind: +d.windpower,
        woodsmall: +d.woodsmall,
        woodindustry: (+d.blackliquor) + (+d.woodindustry),
        peat: +d.peat,
        recoveredfossil: (+d.recoveredfossil) + (+d.demolitionfossil) + (+d.otherwastefuels),
        recoveredbio: (+d.recoveredbio) + (+d.demolitionbio) + (+d.otherbioenergy),
        biogas: +d.biogas,
        solar: +d.solarenergy,
        hydrogen: +d.hydrogen,
        heatpumps: +d.heatpumps,
        industryreactions: +d.industryreactions,
        electricityimport: +d.electricityimport
      }
    })).then(data => setVolumes(data))

    const shareEstimateOfBioBefore1990 = 18.3 / 52.6 // share in 1990
    csv('energysectorco2.csv', d => ({
      date: new Date(+d.year, 0, 1),
      heavyoil: +d.heavyfueloil,
      lightoil: (+d.lightfueloil) + (+d.otheroils),
      transportoil: +d.transportfuels,
      coal: (+d.coal) + (+d.othercoals),
      naturalgas: +d.naturalgas,
      peat: +d.peat,
      otherfossil: (+d.year) < 1990 ? (1 - shareEstimateOfBioBefore1990) * +d.total : ((+d.otherfossilfuels) + (+d.co2transfer)),
      wood: +d.woodfuels,
      otherbio: (+d.year) < 1990 ? shareEstimateOfBioBefore1990 * +d.total : +d.othernonfossilfuels
    })).then(data => setEmissions(data))

  }, [])
  
  return (
    <div className="App">
      <Timeline title="Energy consumption by source" unit="TJ" data={volumes} years={years} keys={volumeKeys} colors={colors}></Timeline>
      <Timeline title="Energy sector carbon dioxide emissions" unit="10⁹ CO₂" data={emissions} years={years} keys={emissionKeys} colors={colors}></Timeline>
    </div>
  )
}

export default App
