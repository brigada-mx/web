import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Bar.css'


class Bar extends React.Component {
  state = {
    modalVisible: false,
  }

  componentDidMount() {
    this._width = this._container.offsetWidth
  }

  componentDidUpdate() {
    this._width = this._container.offsetWidth
  }

  handleMouseEnter = () => {
    this.setState({ modalVisible: true })
  }

  handleMouseLeave = () => {
    this.setState({ modalVisible: false })
  }

  render() {
    const { value, max, style } = this.props
    const green = { flex: value / max }
    const grey = { flex: (max - value) / max }
    const percent = Math.round(100 * value / max)
    const modalWidth = 40
    const modalPadding = 10

    return (
      <div
        ref={(node) => { this._container = node }}
        style={style}
        className={Styles.container}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.state.modalVisible &&
          <div
            style={{
              padding: modalPadding,
              width: modalWidth,
              left: ((this._width || 100) - modalWidth - modalPadding) / 2,
            }}
            className={Styles.modal}
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

Bar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  style: PropTypes.object,
}

export default Bar
