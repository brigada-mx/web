import React from 'react'
import PropTypes from 'prop-types'

import Colors from 'src/Colors'
import Styles from './MetricsBar.css'


class MetricsBar extends React.Component {
  state = {
    tooltipVisible: false,
  }

  componentDidMount() {
    this._width = this._container.offsetWidth
  }

  componentDidUpdate() {
    this._width = this._container.offsetWidth
  }

  handleMouseEnter = () => {
    this.setState({ tooltipVisible: true })
  }

  handleMouseLeave = () => {
    this.setState({ tooltipVisible: false })
  }

  render() {
    const { value, max, style, severity, className = '' } = this.props
    let doneFlex = value / max
    if (Number.isNaN(doneFlex)) doneFlex = 0
    if (doneFlex > 1) doneFlex = 1

    let doneColor = Colors.brandGreen
    if (severity) {
      const multiplier = doneFlex ** 0.75
      const r = { start: 255, end: 255 }
      const g = { start: 255, end: 0 }
      const _r = r.start + multiplier * (r.end - r.start)
      const _g = g.start + multiplier * (g.end - g.start)

      doneColor = `rgb(${Math.round(_r)}, ${Math.round(_g)}, 0)`
    }
    const done = { flex: doneFlex, backgroundColor: doneColor }
    const notDone = { flex: 1 - doneFlex }

    const percent = Math.round(100 * value / max)
    const tooltipWidth = 28
    const tooltipPadding = 10


    return (
      <div
        ref={(node) => { this._container = node }}
        style={style}
        className={`${Styles.bar} ${className}`}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.state.tooltipVisible &&
          <div
            style={{
              padding: tooltipPadding,
              width: tooltipWidth,
              left: ((this._width || 100) - tooltipWidth - tooltipPadding) / 2,
            }}
            className={Styles.tooltip}
          >
            {`${percent}%`}
          </div>
        }
        <div style={done} />
        <div style={notDone} className={Styles.notDone} />
      </div>
    )
  }
}

MetricsBar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  severity: PropTypes.bool,
}

export default MetricsBar
