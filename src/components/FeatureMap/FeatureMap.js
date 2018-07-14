import React from 'react'
import PropTypes from 'prop-types'

import ReactMapboxGl, { Layer, Source, ZoomControl } from 'react-mapbox-gl'
import isEqual from 'lodash/isEqual'

import env from 'src/env'
import MapErrorBoundary from 'components/MapErrorBoundary'
import Styles from './FeatureMap.css'


const { mapbox: { accessToken } } = env

const zoomStyle = { position: 'absolute', top: 26, left: 26, border: 'none', borderRadius: 2 }

class FeatureMap extends React.Component {
  constructor(props) {
    super(props)
    this._initialZoom = [props.initialZoom || 13]
    this._initialCoordinates = props.coordinates || [-95.9042505, 17.1073688]
    this._fitBounds = props.fitBounds
    this._fitBoundsOptions = props.fitBoundsOptions || { padding: 20, maxZoom: 10 }
    this.Mapbox = ReactMapboxGl({
      accessToken,
      scrollZoom: false,
      keyboard: !props.disableKeyboard,
      dragPan: props.dragPan,
      interactive: props.interactive,
    })
  }

  handleMapLoaded = (map) => {
    const { onClickFeature, onEnterFeature, onLeaveFeature, sourceId } = this.props
    map.on('click', sourceId, (e) => {
      onClickFeature(e.features[0])
    })

    map.on('mousemove', sourceId, (e) => {
      // change the cursor style as a ui indicator
      map.getCanvas().style.cursor = 'pointer' // eslint-disable-line no-param-reassign
      onEnterFeature(e.features[0])
    })

    map.on('mouseleave', sourceId, () => {
      map.getCanvas().style.cursor = '' // eslint-disable-line no-param-reassign
      onLeaveFeature()
    })
  }

  cacheFeatureSourceOptions = () => {
    const { features } = this.props
    if (this._features !== features) {
      this._features = features
      this._featureSourceOptions = {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      }
    }
  }

  cacheFitBounds = () => {
    const { fitBounds } = this.props
    if (!isEqual(fitBounds, this._fitBounds)) this._fitBounds = fitBounds
  }

  render() {
    const { Mapbox } = this
    if (!Mapbox) return null

    const {
      popup,
      legend,
      zoomControl,
      features,
      layer,
      sourceOptions,
      sourceLayer,
      filter,
      sourceId,
    } = this.props

    this.cacheFitBounds()
    this.cacheFeatureSourceOptions()

    const { type, paint } = layer

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
          fitBounds={this._fitBounds}
          fitBoundsOptions={this._fitBoundsOptions}
        >
          {popup}
          {legend}
          {zoomControl && <ZoomControl style={zoomStyle} className={Styles.zoomControlContainer} />}
          <Source
            id={sourceId}
            geoJsonSource={features ? this._featureSourceOptions : sourceOptions}
          />
          <Layer
            id={sourceId}
            sourceId={sourceId}
            sourceLayer={sourceLayer}
            filter={filter}
            type={type}
            paint={paint}
          />
        </Mapbox>
      </MapErrorBoundary>
    )
  }
}

FeatureMap.propTypes = {
  sourceId: PropTypes.string,
  zoomControl: PropTypes.bool,
  dragPan: PropTypes.bool,
  interactive: PropTypes.bool,
  initialZoom: PropTypes.number,
  disableKeyboard: PropTypes.bool,
  coordinates: PropTypes.arrayOf(PropTypes.number),
  features: PropTypes.arrayOf(PropTypes.object),
  sourceLayer: PropTypes.string,
  sourceOptions: PropTypes.object,
  layer: PropTypes.object.isRequired,
  filter: PropTypes.arrayOf(PropTypes.any),
  fitBounds: PropTypes.arrayOf(PropTypes.array),
  fitBoundsOptions: PropTypes.object,
  popup: PropTypes.any,
  legend: PropTypes.any,
  onClickFeature: PropTypes.func,
  onEnterFeature: PropTypes.func,
  onLeaveFeature: PropTypes.func,
}

FeatureMap.defaultProps = {
  sourceId: 'features',
  zoomControl: true,
  interactive: true,
  dragPan: true,
  disableKeyboard: false,
  onClickFeature: () => {},
  onEnterFeature: () => {},
  onLeaveFeature: () => {},
}

export default FeatureMap
