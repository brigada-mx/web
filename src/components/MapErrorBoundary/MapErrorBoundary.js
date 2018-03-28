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
            En ciertos dispositivos, Chrome no es capaz de cargar este mapa.
          </span>
          <span>Intenta abrir la página en Firefox, Safari o Edge. Si no funciona <a href="mailto:eduardo@brigada.mx" target="_blank">favor de contactarnos</a>.</span>
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
