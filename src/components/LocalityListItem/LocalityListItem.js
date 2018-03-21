/* eslint-disable quote-props */
import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import { fmtNum } from 'tools/string'
import { metaByDmgGrade } from 'tools/other'
import Styles from './LocalityListItem.css'


const abbreviationByStateName = {
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
  'veracruz de ignacio de la llave': 'VE',
  'yucatán': 'YU',
  'zacatecas': 'ZA',
}

class LocalityListItem extends React.PureComponent {
  render() {
    const { locality, onClick, onMouseEnter, onMouseLeave, focused, to = '' } = this.props
    const {
      name, state_name: stateName, meta: { margGrade, total }, action_count: actions, dmgGrade,
    } = locality

    const handleClick = onClick && (() => { onClick(locality) })
    const handleMouseEnter = onMouseEnter && (() => { onMouseEnter(locality) })
    const handleMouseLeave = onMouseLeave && (() => { onMouseLeave(locality) })

    let className = Styles.listItem
    if (focused) className = `${Styles.listItem} ${Styles.listItemFocused}`

    return (
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
        style={{ borderColor: metaByDmgGrade(dmgGrade).color }}
      >
        <Link style={{ textDecoration: 'none' }} to={to}>
          <div className={Styles.listItemWrapper}>
            <div className={`${Styles.listItemHeader}`}>
              <div className={Styles.name}>{name},</div>
              <div className={Styles.stateName}>{'\u00A0'}
                {abbreviationByStateName[stateName.toLowerCase()] || stateName}
              </div>
            </div>
            <div className={Styles.listItemMetricsContainer}>
              <div className={`${Styles.listItemMetrics} ${Styles.marg}`}>
                <span className={Styles.value}>{margGrade || '?'}</span>
                <span className={Styles.label}>Rezago social</span>
              </div>

              <div className={`${Styles.listItemMetrics} ${Styles.dmg}`}>
                <span className={Styles.value}>{fmtNum(total)}</span>
                <span className={Styles.label}>Viviendas dañadas</span>
              </div>

              <div className={`${Styles.listItemMetrics} ${Styles.act}`}>
                <span className={Styles.value}>{actions}</span>
                <span className={Styles.label}>Proyectos registrados</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

LocalityListItem.propTypes = {
  locality: PropTypes.object.isRequired,
  focused: PropTypes.bool.isRequired,
  to: PropTypes.string,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
}

export default LocalityListItem
