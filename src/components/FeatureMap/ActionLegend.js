import React from 'react'

import Styles from './EstablishmentLegend.css'


const ActionLegend = () => {
  return (
    <div className={Styles.container}>
      <div className={Styles.legendItem}>
        <div>
          <span className={Styles.circle} style={{ backgroundColor: '#3DC59F' }} />
          <span className={Styles.label}>Fotos</span>
        </div>
      </div>
    </div>
  )
}

export default ActionLegend
