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
      className={`${Styles.listItem} Styles.dmg-${dmgGrade}`}
      style={{}}
    >
      <div className={`${Styles.listItemHeader}`}>
        <div className={Styles.locName}>{locName}, </div>
        <div className={Styles.stateName}>{stateName}</div>
      </div>
      <div className={`${Styles.listItemMetrics} row`}>
        <div className="col-lg-4"><span className={Styles.value}>{margGrade || '?'}</span><span className={Styles.label}>Marginación social</span></div>
        <div className="col-lg-4"><span className={Styles.value}>{fmtNum(total)}</span><span className={Styles.label}>Viviendas dañadas</span></div>
      </div>
    </div>
  )
}

LocalityListItem.propTypes = {
  locality: PropTypes.object.isRequired,
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

