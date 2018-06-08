import React from 'react'
import PropTypes from 'prop-types'

import { Map } from 'mapbox-gl'
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

import env from 'src/env'


const { mapbox: { accessToken } } = env

class Geocoder extends React.Component {
  static contextTypes = { map: PropTypes.object.isRequired }

  context: {
    map: Map
  }

  componentDidMount() {
    const { map } = this.context

    map.addControl(
      new MapboxGeocoder({ accessToken })
    )
  }

  render() {
    return null
  }
}

export default Geocoder
