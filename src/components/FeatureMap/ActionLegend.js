import React from 'react'

import Styles from './EstablishmentLegend.css'


const style = { opacity: 0.80, width: 'unset' }

const ActionLegend = () => {
  return (
    <div className={Styles.container} style={style}>
      <div className={Styles.legendItem}>
        <div>
          <span className={Styles.circle} style={{ backgroundColor: '#3DC59F' }} />
          <span className={Styles.label}>Fotos de proyectos</span>
        </div>
      </div>
    </div>
  )
}

export default ActionLegend
