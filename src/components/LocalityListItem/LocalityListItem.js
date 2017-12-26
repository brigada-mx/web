/* eslint-disable quote-props */
import React from 'react'
import PropTypes from 'prop-types'

import { fmtNum } from 'tools/string'
import Colors from 'src/colors'
import Styles from './LocalityListItem.css'


const stateAbbreviation = {
  'aguascalientes': 'AG',
  'baja california': 'BC',
  'baja california sur': 'BS',
  'campeche': 'CM',
  'chiapas': 'CS',
  'chihuahua': 'CH',
  'coahuila': 'CO',
  'colima': 'CL',
  'ciudad de méxico': 'DF',
  'durango': 'DG',
  'guanajuato': 'GT',
  'guerrero': 'GR',
  'hidalgo': 'HG',
  'jalisco': 'JA',
  'estado de méxico': 'EM',
  'méxico': 'EM',
  'michoacán': 'MI',
  'morelos': 'MO',
  'nayarit': 'NA',
  'nuevo león': 'NL',
  'oaxaca': 'OA',
  'puebla': 'PU',
  'querétaro': 'QT',
  'quintana roo': 'QR',
  'san luis potosí': 'SL',
  'sinaloa': 'SI',
  'sonora': 'SO',
  'tabasco': 'TB',
  'tamaulipas': 'TM',
  'tlaxcala': 'TL',
  'veracruz': 'VE',
  'yucatán': 'YU',
  'zacatecas': 'ZA',
}

const dmgGradeColor = {
  severe: Colors.severe,
  high: Colors.high,
  medium: Colors.medium,
  low: Colors.low,
  minimal: Colors.minimal,
  unknown: Colors.unknown,
}

const LocalityListItem = ({ locality, onClick, onMouseEnter, onMouseLeave }) => {
  const {
    name, state_name: stateName, meta: { margGrade, total }, action_count: actions, dmgGrade,
  } = locality

  const handleClick = () => { onClick(locality) }
  const handleMouseEnter = () => { onMouseEnter(locality) }
  const handleMouseLeave = () => { onMouseLeave(locality) }

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
          <div className={Styles.name}>{name},</div>
          <div className={Styles.stateName}>{'\u00A0'}
            {stateAbbreviation[stateName.toLowerCase()] || stateName}
          </div>
        </div>
        <div className={Styles.listItemMetricsContainer}>
          <div className={Styles.listItemMetrics}>
            <span className={Styles.value}>{margGrade || '?'}</span>
            <span className={Styles.label}>Marginación social</span>
          </div>

          <div className={Styles.listItemMetrics}>
            <span className={Styles.value}>{fmtNum(total)}</span>
            <span className={Styles.label}>Viviendas dañadas</span>
          </div>

          <div className={Styles.listItemMetrics}>
            <span className={Styles.value}>{actions}</span>
            <span className={Styles.label}>Acciones totales</span>
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

