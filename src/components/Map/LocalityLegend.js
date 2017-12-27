import React from 'react'
import PropTypes from 'prop-types'

import { fmtNum } from 'tools/string'
import { metaByDmgGrade } from 'tools/other'
import Styles from './LocalityLegend.css'


const LocalityLegend = ({ localities }) => {
  const counts = {
    severe: 0,
    high: 0,
    medium: 0,
    low: 0,
    minimal: 0,
    unknown: 0,
  }

  for (const l of localities) {
    counts[l.properties.dmgGrade] += 1
  }
  const items = Object.keys(counts).map((key) => {
    const { label, color } = metaByDmgGrade[key]
    return (
      <div key={key} className={Styles.legendItem}>
        <div>
          <span className={Styles.circle} style={{ backgroundColor: color }} />
          <span className={Styles.label}>{label}</span>
        </div>
        <span className={Styles.count}>{fmtNum(counts[key])}</span>
      </div>
    )
  })

  return (
    <div className={Styles.container}>
      <p className={Styles.title}>Nivel de daño</p>
      {items}
    </div>
  )
}

LocalityLegend.propTypes = {
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default LocalityLegend
