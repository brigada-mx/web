import React from 'react'
import PropTypes from 'prop-types'

import Styles from './ConfirmButton.css'


class ConfirmButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirm: false,
    }
  }

  toggleConfirm = (confirm) => {
    this.setState({ confirm })
  }

  handleConfirm = () => {
    const { onConfirm, disabled } = this.props
    if (disabled) return
    onConfirm()
  }

  render() {
    const { confirm } = this.state
    const { text, className } = this.props
    if (!confirm) {
      return (
        <div className={`${Styles.row} ${className}`}>
          <span
            onClick={() => this.toggleConfirm(true)}
            className={Styles.link}
          >
            {text}
          </span>
        </div>
      )
    }
    return (
      <div className={`${Styles.row} ${className}`}>
        <span className={Styles.link} style={{ cursor: 'unset' }}>¿Estás seguro?</span>
        <span className={Styles.link} onClick={this.handleConfirm}>Sí</span>
        <span className={Styles.link} onClick={() => this.toggleConfirm(false)}>No</span>
      </div>
    )
  }
}

ConfirmButton.propTypes = {
  text: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

ConfirmButton.defaultProps = {
  disabled: false,
}

export default ConfirmButton
