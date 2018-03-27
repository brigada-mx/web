import React from 'react'
import PropTypes from 'prop-types'

import Styles from './MapErrorBoundary.css'


class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={Styles.container}>
          <span>
            No se pudo cargar el mapa. Es posible que no tienes habilitado WebGL.
          </span>
          <span>Intenta abrir la página en otro navegador. Si no funciona favor de contactarnos.</span>
          <span>Si quieres checar si tienes WebGL habilitado, <a href="http://webglreport.com/?v=1" target="_blank">ve a esta página</a>.</span>
        </div>
      )
    }
    return this.props.children
  }
}

MapErrorBoundary.propTypes = {
  children: PropTypes.any,
}

export default MapErrorBoundary
