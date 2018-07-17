import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import isMobile from 'tools/isMobile'
import Styles from './MapErrorBoundary.css'


class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
  }

  openVideoModal = (videoId) => {
    this.props.modal('youTubeVideo', { modalTransparent: true, videoId })
  }

  render() {
    if (this.state.hasError) {
      let mobile = false
      try {
        mobile = isMobile()
      } catch (e) {}

      if (mobile) {
        return (
          <div className={Styles.container}>
            <span>No se pudo cargar el mapa.</span>
            <span>Por favor intenta abrir la página con otro navegador. Si no funciona <a className={Styles.link} href="mailto:eduardo@brigada.mx" target="_blank" rel="noopener noreferrer">favor de contactarnos</a>.</span>
          </div>
        )
      }

      return (
        <div className={Styles.container}>
          <span>
            Tu navegador no puede cargar el mapa, pero normalmente es fácil de arreglar.
          </span>
          <span className={Styles.link} onClick={() => this.openVideoModal('qMimEKh7n1M')}>Estoy usando Chrome.</span>
          <span className={Styles.link} onClick={() => this.openVideoModal('54Yo984UL7o')}>Estoy usando Safari.</span>
          <span>Si esto no funciona, por favor intenta abrir la página con otro navegador, como Firefox o Edge.</span>
        </div>
      )
    }
    return this.props.children
  }
}

MapErrorBoundary.propTypes = {
  children: PropTypes.any,
  modal: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default connect(null, mapDispatchToProps)(MapErrorBoundary)
