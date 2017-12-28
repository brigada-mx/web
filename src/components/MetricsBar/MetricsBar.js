import React from 'react'
import PropTypes from 'prop-types'

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
    const { value, max, style } = this.props
    const green = { flex: value / max }
    const grey = { flex: (max - value) / max }
    const percent = Math.round(100 * value / max)
    const tooltipWidth = 28
    const tooltipPadding = 10

    return (
      <div
        ref={(node) => { this._container = node }}
        style={style}
        className={Styles.container}
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
        <div style={green} className={Styles.green} />
        <div style={grey} className={Styles.grey} />
      </div>
    )
  }
}

MetricsBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  style: PropTypes.object,
}

export default MetricsBar
