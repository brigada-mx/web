import React from 'react'
import PropTypes from 'prop-types'

import { Popup } from 'react-mapbox-gl'

import { fmtNum } from 'tools/string'


const LocalityListItem = ({ feature, onClick, onMouseEnter, onMouseLeave }) => {
  const { stateName, locName, habit, notHabit, destroyed, total, margGrade } = feature.properties
  const { coordinates } = feature.geometry
  return (
    <Popup
      coordinates={coordinates}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="popup-header">{locName}, {stateName}</span>
      <div className="popup-item"><span className="popup-label">VIVIENDAS DAÑADAS</span> <span className="popup-value">{fmtNum(total)}</span></div>
      <div className="popup-item"><span className="popup-label">HABITABLES</span> <span className="popup-value">{fmtNum(habit)}</span></div>
      <div className="popup-item"><span className="popup-label">NO HABITABLES</span> <span className="popup-value">{fmtNum(notHabit)}</span></div>
      <div className="popup-item"><span className="popup-label">PÉRDIDA TOTAL</span> <span className="popup-value">{fmtNum(destroyed)}</span></div>
      <div className="popup-item"><span className="popup-label">GRADO MARGINACIÓN</span> <span className="popup-value">{fmtNum(margGrade)}</span></div>
    </Popup>
  )
}

LocalityListItem.propTypes = {
  feature: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
}

LocalityListItem.defaultProps = {
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
}

export default LocalityListItem

