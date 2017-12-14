import React from 'react'
import PropTypes from 'prop-types'

import { Popup } from 'react-mapbox-gl'

import { fmtNum } from 'tools/string'
import Styles from './LocalityPopup.css'


const LocalityPopup = ({ locality }) => {
  const { stateName, locName, habit, notHabit, destroyed, total, margGrade } = locality.properties
  const { coordinates } = locality.geometry
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

LocalityPopup.propTypes = {
  locality: PropTypes.object.isRequired,
}

export default LocalityPopup
