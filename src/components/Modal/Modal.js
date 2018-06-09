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
    const main = document.getElementById('app')
    if (main) main.classList.add('brigadaModalOpen')
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    const main = document.getElementById('app')
    if (main) main.classList.remove('brigadaModalOpen')
  }

  handleKeyDown = (e) => {
    try {
      if (e.keyCode === 27) this.handleClose() // 8 is keyCode for delete key
    } catch (exception) {}
  }

  handleClose = () => {
    const { closeModal, onClose } = this.props
    closeModal()
    if (onClose) onClose()
  }

  render() {
    const {
      children, transparent = false, contentClassName = '', buttonClassName = '', padded = true,
    } = this.props
    return ReactDOM.createPortal(
      <div className={Styles.container}>
        <div className={Styles.overlay} />
        <div className={`${transparent ? Styles.contentTransparent : Styles.content} ${contentClassName} ${padded ? Styles.contentPadded : ''}`}>
          <span className={`${Styles.closeButton} ${buttonClassName}`} onClick={this.handleClose} />
          {children}
        </div>
      </div>,
      modalRoot,
    )
  }
}

Modal.propTypes = {
  children: PropTypes.any,
  transparent: PropTypes.bool,
  padded: PropTypes.bool,
  onClose: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
  contentClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  gaName: PropTypes.string,
}


const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => Actions.modal(dispatch, ''),
  }
}

export default connect(null, mapDispatchToProps)(Modal)
