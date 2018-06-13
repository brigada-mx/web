import React from 'react'
import PropTypes from 'prop-types'

import ReactMapboxGl, { Layer, Feature, ZoomControl } from 'react-mapbox-gl'

import env from 'src/env'
import MapErrorBoundary from 'components/MapErrorBoundary'
import GoogleGeocoder from 'components/GoogleGeocoder'
import Styles from './FeatureMap.css'


const { mapbox: { accessToken }, google: { apiKey } } = env

const zoomStyle = { position: 'absolute', top: 26, left: 26, border: 'none', borderRadius: 2 }
const layer = {
  type: 'circle',
  paint: {
    'circle-radius': 8,
    'circle-color': '#3DC587',
  },
}

class ChooseLocationMap extends React.Component {
  constructor(props) {
    super(props)
    this._initialZoom = [props.initialZoom || 13]
    this.Mapbox = ReactMapboxGl({
      accessToken,
      scrollZoom: true,
      dragPan: props.dragPan,
    })

    this.state = {
      coordinates: props.coordinates,
      centerCoordinates: props.coordinates,
    }
  }

  handleMapLoaded = (map) => {
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat
      this.props.onLocationChange({ lng, lat })
      this.setState({ coordinates: [lng, lat] })
    })
  }

  handleSelect = ({ geometry: { location: { lat, lng } } }) => {
    this.props.onLocationChange({ lng, lat })
    this.setState({ coordinates: [lng, lat], centerCoordinates: [lng, lat] })
  }

  geocoderFilter = ({ value }) => {
    try {
      const { address_components: components } = value
      const comp = components.find(c => c.types.includes('country'))
      if (!comp) return true
      return comp.long_name.toLowerCase() === 'mexico' || comp.short_name.toLowerCase() === 'mx'
    } catch (e) {
      return true
    }
  }

  render() {
    const { Mapbox } = this
    if (!Mapbox) return null

    const { legend, zoomControl } = this.props

    return (
      <MapErrorBoundary>
        <Mapbox
          style="mapbox://styles/kylebebak/cj95wutp2hbr22smynacs9gnk" // eslint-disable-line react/style-prop-object
          zoom={this._initialZoom}
          center={this.state.centerCoordinates}
          containerStyle={{
            height: '100%',
            width: '100%',
            position: 'relative',
          }}
          onStyleLoad={this.handleMapLoaded}
        >
          <GoogleGeocoder
            apiKey={apiKey}
            onSelect={this.handleSelect}
            numResults={5}
            filter={this.geocoderFilter}
          />
          {legend}
          {zoomControl && <ZoomControl style={zoomStyle} className={Styles.zoomControlContainer} />}
          <Layer {...layer}>
            <Feature coordinates={this.state.coordinates} />
          </Layer>
        </Mapbox>
      </MapErrorBoundary>
    )
  }
}

ChooseLocationMap.propTypes = {
  onLocationChange: PropTypes.func.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoomControl: PropTypes.bool,
  dragPan: PropTypes.bool,
  initialZoom: PropTypes.number,
  legend: PropTypes.any,
}

ChooseLocationMap.defaultProps = {
  zoomControl: true,
  dragPan: true,
}

export default ChooseLocationMap
