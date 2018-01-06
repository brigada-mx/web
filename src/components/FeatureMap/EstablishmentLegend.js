import React from 'react'
import PropTypes from 'prop-types'

import Styles from './EstablishmentLegend.css'


export const metaByScianGroup = {
  1: { color: '#2965CC', icon: 'doctor-15', name: 'Sin categorizar' },
  2: { color: '#29A634', icon: 'dog-park-15', name: 'Administración pública' },
  3: { color: '#D99E0B', icon: 'drinking-water-15', name: 'Almacenamiento' },
  4: { color: '#D13913', icon: 'embassy-15', name: 'Asociaciones y organizaciones' },
  5: { color: '#8F398F', icon: 'entrance-15', name: 'Atención médica y psicológica' },
  6: { color: '#00B3A4', icon: 'fast-food-15', name: 'Construcción y material' },
  7: { color: '#DB2C6F', icon: 'ferry-15', name: 'Educación' },
  8: { color: '#9BBF30', icon: 'fire-station-15', name: 'Espacio público' },
  9: { color: '#96622D', icon: 'fuel-15', name: 'Servicios de emergencia' },
  10: { color: '#7157D9', icon: 'garden-15', name: 'Transporte' },
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
    const { color, icon, name } = metaByScianGroup[g]
    return (
      <div
        key={g}
        className={Styles.legendItem}
      >
        <span className={Styles.circle} style={{ backgroundColor: color }} />
        <span>{name} {counts[g]}</span>
      </div>
    )
  })

  return (
    <div className={Styles.container}>
      <p className={Styles.title}>Infraestructura local</p>
      {items}
    </div>
  )
}

EstablishmentLegend.propTypes = {
  establishments: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default EstablishmentLegend
