import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Icon.css'


class Icon extends React.Component {
  state = { focused: false }

  handleMouseEnter = () => {
    this.setState({ focused: true })
  }

  handleMouseLeave = () => {
    this.setState({ focused: false })
  }

  toggleFocused = () => {
    this.setState({ focused: !this.state.focused })
  }

  render() {
    const { src, height, ttText, ttTop, ttWidth, ttLeft = 0, className = '', alt = '' } = this.props
    const { focused } = this.state

    return (
      <div
        className={Styles.container}
      >
        <img
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.toggleFocused}
          src={src}
          alt={alt}
          height={height}
          className={className}
        />
        {focused && <div style={{ top: ttTop, width: ttWidth, left: ttLeft }} className={Styles.tooltip}>{ttText}</div>}
      </div>
    )
  }
}

Icon.propTypes = {
  src: PropTypes.string.isRequired,
  ttText: PropTypes.string.isRequired,
  ttTop: PropTypes.number.isRequired,
  ttWidth: PropTypes.number.isRequired,
  ttLeft: PropTypes.number,
  alt: PropTypes.string,
  height: PropTypes.number,
  className: PropTypes.string,
}

export default Icon
