import React from 'react'

const TransparencyDialog = ({show, hide}) => {

  if (!show) {
    return (
      <></>
    )
  }
  return (
    <div className="dialog-shadow" onClick={() => hide()}>
      <div className="dialog-box">
        <button className="dialog-close" title="Close" onClick={() => hide()}>X</button>
        <h3>Data Transparency Statement</h3>
        <p>
          <a href="https://www.stat.fi/index_en.html">Statistics Finland</a> publishes time series of
          yearly primary energy consumption¹ by energy source from 1960 to 2018
          and greenhouse gas, more specifically carbon dioxide (CO₂), emissions² by fuel from 1990 to 2018.
          Statistics Finland works as a government established public authority which under review provides statistics for decision making and research.
          One of their responsibilities is the annual national inventory report on greenhouse gases for United Nations Framework Convention on Climate Change.
          The data collection for that is accepted as defined in national inventory system and carried out with the Finnish Environment Institute,
          the Natural Resources Institute, and the VTT Technical Research Center of Finland. For energy consumption they collect data from
          Finnish energy organisations and directly from industry. The data is as current as official statistics get.
          It is updated yearly but lags 1-2 years behind.
        </p>
        <p>
          <ol>
            <li><a href="https://pxhopea2.stat.fi/sahkoiset_julkaisut/energia2019/html/engl0000.htm">1.1-5 Total energy consumption by energy source</a></li>
            <li><a href="https://pxhopea2.stat.fi/sahkoiset_julkaisut/energia2019/html/engl0011.htm">12.3.1 Carbon dioxide emissions by fuels</a></li>
          </ol>
        </p>
        <p>
          * This visualization incorporates energy consumption data starting from 1960. However, emission data by fuels exists only since 1990.
          Before that from 1970 we visualize just total emission level that is available in the data.
        </p>
        <p>
          * For animation purposes we interpolate data points between years. Linear interpolation <strong>ignores seasonal variance inside each year</strong>
          which would in reality display as pulsing change peaking every winter.
        </p>
        <p>
          * The red level at the energy sector CO₂ emissions timeline marks 40% reduction from 1990 level. This is the minimum 2030 reduction goal set for whole EU
          to meet Paris agreement. In practice, goals for individual countries are agreed separately and Finland's targets are more ambitious. Also the target
          emission levels are already argued to be too high to meet the Paris climate goals. We will keep the overal 40% guideline here as the actual goals are
          agreed inside different economical sectors.
        </p>
      </div>
    </div>
  )
}

export default TransparencyDialog
