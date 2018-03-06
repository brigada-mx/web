import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import ReactGA from 'react-ga'

import Styles from './Modal.css'


const modalRoot = document.getElementById('modal')

class Modal extends React.Component {
  componentDidMount() {
    ReactGA.modalview(`${window.location.pathname}/_/${this.props.gaName || ''}`)
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
    return ReactDOM.createPortal(
      <div className={`${Styles.container} ${className}`}>
        <span className={Styles.closeButton} onClick={onClose}>X</span>
        {children}
      </div>,
      modalRoot,
    )
  }
}

Modal.propTypes = {
  children: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  gaName: PropTypes.string,
}

export default Modal
