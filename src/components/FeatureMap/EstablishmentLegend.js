import React from 'react'
import PropTypes from 'prop-types'

import Styles from './EstablishmentLegend.css'


export const metaByScianGroup = {
  1: { icon: 'doctor-15', name: 'escuela' },
  2: { icon: 'dog-park-15', name: 'iglesia' },
  3: { icon: 'drinking-water-15', name: 'parque' },
  4: { icon: 'embassy-15', name: 'mercado' },
  5: { icon: 'entrance-15', name: 'hospital' },
  6: { icon: 'fast-food-15', name: 'restaurante' },
  7: { icon: 'ferry-15', name: 'ferretería' },
  8: { icon: 'fire-station-15', name: 'changarro' },
  9: { icon: 'fuel-15', name: 'antro' },
  10: { icon: 'garden-15', name: 'mezcalería' },
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
