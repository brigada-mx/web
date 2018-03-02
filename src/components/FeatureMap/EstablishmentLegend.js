import React from 'react'
import PropTypes from 'prop-types'

import { fmtNum } from 'tools/string'
import Styles from './EstablishmentLegend.css'


export const metaByScianGroup = {
  1: { color: '#CCCCCC', name: 'Sin categorizar' },
  2: { color: '#CDDC39', name: 'Administración pública' },
  4: { color: '#4CAF50', name: 'Asociaciones y organizaciones' },
  5: { color: '#009688', name: 'Atención médica y psicológica' },
  6: { color: '#00BCD4', name: 'Construcción y material' },
  7: { color: '#2196F3', name: 'Educación' },
  8: { color: '#3F51B5', name: 'Espacio público' },
  10: { color: '#9C27B0', name: 'Transporte' },
}

const EstablishmentLegend = ({ establishments }) => {
  const counts = {}
  for (const e of establishments) {
    const { scian_group: group } = e
    if (group in counts) {
      counts[group] += 1
    } else {
      counts[group] = 1
    }
  }

  const items = Object.keys(counts).sort((a, b) => a - b).map((g) => {
    const { color, name } = metaByScianGroup[g]
    return (
      <div key={g} className={Styles.legendItem}>
        <div>
          <span className={Styles.circle} style={{ backgroundColor: color }} />
          <span className={Styles.label}>{name}</span>
        </div>
        <span className={Styles.count}>{fmtNum(counts[g])}</span>
      </div>
    )
  })

  return (
    <div className={Styles.container}>
      <p className={Styles.title}>Infraestructura local</p>
      {establishments.length > 0 && items}
      {establishments.length > 0 && <p className={Styles.source}>FUENTE: INEGI</p>}
      {establishments.length === 0 && <p>INEGI no tiene datos para esta localidad</p>}
    </div>
  )
}

EstablishmentLegend.propTypes = {
  establishments: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default EstablishmentLegend
