export const consumptionKeys = {
    all: [ 'coal','peat','oils','naturalgas','industryreactions','wood','nuclear','electricityimport','hydro','wind','heatpumps','other' ],
    heating: [ 'coal', 'peat', 'heavyoil', 'lightoil', 'naturalgas', 'recoveredfossil', 'woodsmall', 'recoveredbio', 'heatpumps' ],
    electricity: [ 'nuclear', 'electricityimport', 'hydro', 'wind', 'solar' ],
    traffic: [ 'gasoline', 'diesel', 'biogasoline', 'biodiesel', 'biogas' ]
}

export const parseConsumptionRow = d => ({
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
        
    gasoline: +d.gasoline,
    biogasoline: +d.biogasoline,
    diesel: +d.diesel,
    biodiesel: +d.biodiesel,
    lpg: +d.lpg,
    lightoil: +d.lightfueloil,
    heavyoil: +d.heavyfueloil,
    otheroils: (+d.otheroils) + (+d.biofueloil) + (+d.recycledoil) + (+d.refinerygas),
    //coal: +d.coaltotal,
    //naturalgas: +d.naturalgas,
    //nuclear: +d.nuclearenergy,
    //hydro: +d.hydropower,
    //wind: +d.windpower,
    woodsmall: +d.woodsmall,
    woodindustry: (+d.blackliquor) + (+d.woodindustry),
    //peat: +d.peat,
    recoveredfossil: (+d.recoveredfossil) + (+d.demolitionfossil) + (+d.otherwastefuels),
    recoveredbio: (+d.recoveredbio) + (+d.demolitionbio) + (+d.otherbioenergy),
    biogas: +d.biogas,
    solar: +d.solarenergy,
    hydrogen: +d.hydrogen,
    //heatpumps: +d.heatpumps,
    //industryreactions: +d.industryreactions,
    //electricityimport: +d.electricityimport,
})