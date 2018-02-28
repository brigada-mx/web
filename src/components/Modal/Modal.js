import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Modal.css'


class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = (e) => {
    try {
      if (e.keyCode === 27) this.props.onClose() // 8 is keyCode for delete key
    } catch (exception) {}
  }

  render() {
    const { children, onClose, className = '' } = this.props
    return (
      <div className={`${Styles.container} ${className}`}>
        <span className={Styles.closeButton} onClick={onClose}>X</span>
        {children}
      </div>
    )
  }
}

Modal.propTypes = {
  children: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default Modal
