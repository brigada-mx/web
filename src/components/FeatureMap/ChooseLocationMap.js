import React from 'react'
import PropTypes from 'prop-types'

import ReactMapboxGl, { Layer, Feature, ZoomControl } from 'react-mapbox-gl'

import env from 'src/env'
import MapErrorBoundary from 'components/MapErrorBoundary'
import Styles from './FeatureMap.css'


const { mapbox: { accessToken } } = env

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
    this._initialZoom = [props.initialZoom || 12]
    this._initialCoordinates = props.coordinates
    this.Mapbox = ReactMapboxGl({
      accessToken,
      scrollZoom: true,
      dragPan: props.dragPan,
    })

    this.state = {
      coordinates: props.coordinates,
    }
  }

  handleMapLoaded = (map) => {
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat
      this.props.onLocationChange({ lng, lat })
      this.setState({ coordinates: [lng, lat] })
    })
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
          center={this._initialCoordinates}
          containerStyle={{
            height: '100%',
            width: '100%',
            position: 'relative',
          }}
          onStyleLoad={this.handleMapLoaded}
        >
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
