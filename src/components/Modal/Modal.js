import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import ReactGA from 'react-ga'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import { parseQs } from 'tools/string'
import { toQs } from 'api/request'
import Styles from './Modal.css'


const modalRoot = document.getElementById('modal')

class Modal extends React.Component {
  componentDidMount() {
    ReactGA.modalview(`${window.location.pathname}/_/${this.props.gaName || ''}`)
    if (this.props.cancelShortcut) document.addEventListener('keydown', this.handleKeyDown)

    this._scrollTop = document.body && document.body.scrollTop
    const main = document.getElementById('app')
    if (main) main.classList.add('brigadaModalOpen')
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)

    const main = document.getElementById('app')
    if (main) main.classList.remove('brigadaModalOpen')
    if (document.body) document.body.scrollTop = this._scrollTop || 0
  }

  handleKeyDown = (e) => {
    try {
      if (e.keyCode === 27) this.handleClose() // 8 is keyCode for delete key
    } catch (exception) {}
  }

  handleClose = () => {
    const { closeModal, onClose, history, location } = this.props
    const obj = parseQs(location.search)

    delete obj._mn
    delete obj._ms

    history.replace({ pathname: location.pathname, search: toQs(obj, { encode: false }) })
    closeModal()
    if (onClose) onClose()
  }

  render() {
    const {
      children, transparent = false, contentClassName = '', buttonClassName = '', padded = true, transparentBackground,
    } = this.props
    return ReactDOM.createPortal(
      <div className={Styles.container}>
        <div className={transparentBackground ? Styles.overlay : Styles.blackOverlay} />
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
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  children: PropTypes.any,
  transparent: PropTypes.bool,
  transparentBackground: PropTypes.bool,
  padded: PropTypes.bool,
  cancelShortcut: PropTypes.bool,
  onClose: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
  contentClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  gaName: PropTypes.string,
}

Modal.defaultProps = {
  cancelShortcut: true,
  transparentBackground: true,
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => Actions.modal(dispatch, ''),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Modal))
