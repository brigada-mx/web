/* eslint-disable quote-props */
import React from 'react'
import PropTypes from 'prop-types'

import { fmtNum } from 'tools/string'
import Colors from 'src/colors'
import Styles from './LocalityListItem.css'


const stateAbbreviation = {
  'aguascalientes': 'Ags.',
  'baja california': 'B.C.',
  'baja california sur': 'B.C.S.',
  'campeche': 'Camp.',
  'chiapas': 'Chis.',
  'chihuahua': 'Chih.',
  'coahuila': 'Coah.',
  'colima': 'Col.',
  'ciudad de méxico': 'CDMX',
  'durango': 'Dgo.',
  'guanajuato': 'Gto.',
  'guerrero': 'Gro.',
  'hidalgo': 'Hgo.',
  'jalisco': 'Jal.',
  'méxico': 'Edomex.',
  'estado de méxico': 'Edomex.',
  'michoacán': 'Mich.',
  'morelos': 'Mor.',
  'nayarit': 'Nay.',
  'nuevo león': 'N.L.',
  'oaxaca': 'Oax.',
  'puebla': 'Pue.',
  'querétaro': 'Qro.',
  'quintana roo': 'Q. Roo',
  'san luis potosí': 'S.L.P.',
  'sinaloa': 'Sin.',
  'sonora': 'Son.',
  'tabasco': 'Tab.',
  'tamaulipas': 'Tamps.',
  'tlaxcala': 'Tlax.',
  'veracruz': 'Ver.',
  'yucatán': 'Yuc.',
  'zacatecas': 'Zac.',
}

const LocalityListItem = ({ locality, onClick, onMouseEnter, onMouseLeave }) => {
  const { locName, stateName, margGrade, total = '?', dmgGrade } = locality.properties

  const handleClick = () => { onClick(locality) }
  const handleMouseEnter = () => { onMouseEnter(locality) }
  const handleMouseLeave = () => { onMouseLeave(locality) }

  const dmgGradeColor = {
    severe: Colors.severe,
    high: Colors.high,
    medium: Colors.medium,
    low: Colors.low,
    minimal: Colors.minimal,
    unknown: Colors.unknown,
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={Styles.listItem}
      style={{ borderColor: dmgGradeColor[dmgGrade] || Colors.unknown }}
    >
      <div className={Styles.listItemWrapper}>
        <div className={`${Styles.listItemHeader}`}>
          <div className={Styles.locName}>{locName},</div>
          <div className={Styles.stateName}>{'\u00A0'}
            {stateAbbreviation[stateName.toLowerCase()] || stateName}
          </div>
        </div>
        <div className={`${Styles.listItemMetrics} row`}>
          <div className="col-lg-4 col-md-4">
            <span className={Styles.value}>{margGrade || '?'}</span>
            <span className={Styles.label}>Marginación social</span>
          </div>
          <div className="col-lg-4 col-md-4">
            <span className={Styles.value}>{fmtNum(total)}</span>
            <span className={Styles.label}>Viviendas dañadas</span>
          </div>
        </div>
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

