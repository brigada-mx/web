import React from 'react'
import PropTypes from 'prop-types'

import Styles from './StackedMetricsBar.css'


const StackedMetricsBar = ({ values, labels, style }) => {
  if (values.length !== labels.length) return null

  const bars = values.map((v, i) => {
    const barStyle = { flex: v, opacity: (i + 1) / values.length }
    if (v === 0) {
      barStyle.margin = 0
    }
    return <div key={i} style={barStyle} className={Styles.bar} />
  })

  const barLabels = labels.map((l, i) => {
    const labelStyle = { opacity: (i + 1) / labels.length }
    if (values[i] === 0) return null
    return <span style={labelStyle} key={i} className={Styles.label}>{l}</span>
  })

  return (
    <div style={style}>
      <div className={Styles.barsContainer}>
        {bars}
      </div>
      <div>
        {barLabels}
      </div>
    </div>
  )
}

StackedMetricsBar.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  style: PropTypes.object,
}

export default StackedMetricsBar
