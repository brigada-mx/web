import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import * as Actions from 'src/actions'
import { connect } from 'react-redux'
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

  handleClose = () => {
    const { closeModal, onClose } = this.props
    closeModal()
    onClose()
  }

  render() {
    const { children, className = '', buttonClassName = '' } = this.props
    return ReactDOM.createPortal(
      <div className={`${Styles.container} ${className}`}>
        <span className={`${Styles.closeButton} ${buttonClassName}`} onClick={this.handleClose}>X</span>
        {children}
      </div>,
      modalRoot,
    )
  }
}

Modal.propTypes = {
  children: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  gaName: PropTypes.string,
}


const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => Actions.modal(dispatch, ''),
  }
}

export default connect(null, mapDispatchToProps)(Modal)
