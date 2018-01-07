import React from 'react'
import PropTypes from 'prop-types'

import Styles from './StackedMetricsBar.css'


class MetricsBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
  }

  handleMouseEnter = () => {
    this.setState({ active: true })
  }

  handleMouseLeave = () => {
    this.setState({ active: false })
  }

  render() {
    const { barStyle, value, label } = this.props
    return (
      <div
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={barStyle}
        className={Styles.bar}
      >
        {this.state.active && <span className={Styles.barLabel}>{label}: {value}</span>}
      </div>
    )
  }
}

MetricsBar.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  barStyle: PropTypes.object.isRequired,
}

const StackedMetricsBar = ({ values, labels, style }) => {
  if (values.length !== labels.length) return null

  const bars = values.map((v, i) => {
    const barStyle = { flex: v, opacity: (i + 1) / values.length }
    if (v === 0) {
      barStyle.margin = 0
    }
    return <MetricsBar key={i} value={v} label={labels[i]} barStyle={barStyle} />
  })

  const barLabels = labels.map((l, i) => {
    const labelStyle = { opacity: (i + 1) / labels.length }
    return (
      <div key={i} className={Styles.legendContainer}>
        <span style={labelStyle} className={Styles.circle} />
        <span className={Styles.label}>{l}</span>
      </div>
    )
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
