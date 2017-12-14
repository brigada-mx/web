import React from 'react'
import PropTypes from 'prop-types'

import { fmtNum } from 'tools/string'
import Styles from './LocalityListItem.css'


const LocalityListItem = ({ locality, onClick, onMouseEnter, onMouseLeave }) => {
  const { locName, stateName, margGrade, total = '?', dmgGrade } = locality.properties

  const handleClick = () => { onClick(locality) }
  const handleMouseEnter = () => { onMouseEnter(locality) }
  const handleMouseLeave = () => { onMouseLeave(locality) }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`list-item dmg-${dmgGrade}`}
      style={{}}
    >
      <div className="list-item-header">{locName}, {stateName}</div>
      <div className="list-item-metrics">
        <div><span className="label">MARG. SOCIAL</span> <span className="value">{margGrade || '?'}</span></div>
        <div><span className="label">VIVIENDAS DAÑADAS</span> <span className="value">{fmtNum(total)}</span></div>
      </div>
    </div>
  )
}

LocalityListItem.propTypes = {
  locality: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
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

