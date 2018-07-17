import React from 'react'
import PropTypes from 'prop-types'

import { fmtNum } from 'tools/string'
import { metaByDmgGrade } from 'tools/other'
import Styles from './LocalityLegend.css'


const LocalityLegend = ({ localities, legendTitle }) => {
  const counts = {
    severe: 0,
    high: 0,
    medium: 0,
    low: 0,
    unknown: 0,
  }

  for (const l of localities) {
    counts[l.dmgGrade] += 1
  }
  const items = Object.keys(counts).map((key) => {
    const { label, color } = metaByDmgGrade(key)
    let className = Styles.legendItem
    if (key === 'unknown') className = `${className} xs-hidden`
    return (
      <div key={key} className={className}>
        <div>
          <span className={Styles.circle} style={{ backgroundColor: color }} />
          <span className={Styles.label}>{label}</span>
        </div>
        <span className={Styles.count}>{fmtNum(counts[key])}</span>
      </div>
    )
  })
  if (counts.unknown === 0) items.pop()

  return (
    <div className={Styles.container}>
      <p className={Styles.title}>{legendTitle}</p>
      {items}
      <p className={Styles.source}>Fuente: SEDATU</p>
    </div>
  )
}

LocalityLegend.propTypes = {
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
  legendTitle: PropTypes.string.isRequired,
}

export default LocalityLegend
