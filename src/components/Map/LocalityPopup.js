import React from 'react'

import { Popup } from 'react-mapbox-gl'

import { fmtNum } from 'tools/string'


const LocalityPopup = ({ feature }) => { // eslint-disable-line react/prop-types
  const { stateName, locName, habit, notHabit, destroyed, total, margGrade } = feature.properties
  const { coordinates } = feature.geometry
  return (
    <Popup coordinates={coordinates}>
      <span className="popup-header">{locName}, {stateName}</span>
      <div className="popup-item"><span className="popup-label">VIVIENDAS DAÑADAS</span> <span className="popup-value">{fmtNum(total)}</span></div>
      <div className="popup-item"><span className="popup-label">HABITABLES</span> <span className="popup-value">{fmtNum(habit)}</span></div>
      <div className="popup-item"><span className="popup-label">NO HABITABLES</span> <span className="popup-value">{fmtNum(notHabit)}</span></div>
      <div className="popup-item"><span className="popup-label">PÉRDIDA TOTAL</span> <span className="popup-value">{fmtNum(destroyed)}</span></div>
      <div className="popup-item"><span className="popup-label">GRADO MARGINACIÓN</span> <span className="popup-value">{fmtNum(margGrade)}</span></div>
    </Popup>
  )
}

export default LocalityPopup
