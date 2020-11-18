export const emissionsKeys = {
    all: ['coal','peat','heavyoil','lightoil','transportoil','naturalgas','otherfossil','wood','otherbio'],
    heating: ['coal','peat','heavyoil','lightoil','naturalgas','otherfossil','otherbio'],
    electricity: ['coal','peat','heavyoil','lightoil','naturalgas','otherfossil'],
    traffic: ['transportoil']
}

export const parseEmissionsRow = d => ({
    date: new Date(+d.year, 0, 1),
    heavyoil: +d.heavyfueloil,
    lightoil: (+d.lightfueloil) + (+d.otheroils),
    transportoil: +d.transportfuels,
    coal: (+d.coal) + (+d.othercoals),
    naturalgas: +d.naturalgas,
    peat: +d.peat,
    otherfossil: (+d.year) < 1990 ? +d.total : ((+d.otherfossilfuels) + (+d.co2transfer)),
    wood: +d.woodfuels,
    otherbio: +d.othernonfossilfuels
})

export const emissionsZeroYears = (begin, end) => {
    const emissions = []
    for (let year = begin; year < end; year++) {
        emissions.push({
            date: new Date(year, 0, 1),
            heavyoil: 0,
            lightoil: 0,
            transportoil: 0,
            coal: 0,
            naturalgas: 0,
            peat: 0,
            otherfossil: 0,
            wood: 0,
            otherbio: 0
        })
    }
    return emissions
}
