import React from 'react'
import PropTypes from 'prop-types'

import Styles from './EstablishmentLegend.css'


export const metaByScianGroup = {
  1: { icon: 'doctor-15', name: 'Sin categorizar' },
  2: { icon: 'dog-park-15', name: 'Administración pública' },
  3: { icon: 'drinking-water-15', name: 'Almacenamiento' },
  4: { icon: 'embassy-15', name: 'Asociaciones y organizaciones' },
  5: { icon: 'entrance-15', name: 'Atención médica y psicológica' },
  6: { icon: 'fast-food-15', name: 'Construcción y material' },
  7: { icon: 'ferry-15', name: 'Educación' },
  8: { icon: 'fire-station-15', name: 'Espacio público' },
  9: { icon: 'fuel-15', name: 'Servicios de emergencia' },
  10: { icon: 'garden-15', name: 'Transporte' },
}

const EstablishmentLegend = ({ groups }) => {
  const items = groups.sort((a, b) => a - b).map((g) => {
    const { icon, name } = metaByScianGroup[g]
    return <div key={g} className={Styles.legendItem}>{icon}, {name}</div>
  })

  return (
    <div className={Styles.container}>
      <p className={Styles.title}>Infraestructura local</p>
      {items}
    </div>
  )
}

EstablishmentLegend.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.number).isRequired,
}

export default EstablishmentLegend
