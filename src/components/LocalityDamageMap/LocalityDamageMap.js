import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import ReactMapboxGl, { Layer, Source, ZoomControl } from 'react-mapbox-gl'

import env from 'src/env'
import colors from 'src/colors'
import { generateSizeStops } from 'tools/other'
import Styles from './LocalityDamageMap.css'


const { mapbox: { accessToken } } = env

const zoomStyle = {
  position: 'absolute',
  top: 26,
  right: 26,
  border: 'none',
  borderRadius: 2,
}

class LocalityDamageMap extends React.Component {
  constructor(props) {
    super(props)
    const _initialZoom = props.initialZoom || 6
    this._initialZoom = [_initialZoom]
    this._initialCoordinates = [-95.9042505, 17.1073688]
    this._fitBounds = props.fitBounds
    this._fitBoundsOptions = props.fitBoundsOptions || { padding: 20, maxZoom: 10 }

    this._layerPaint = {
      'circle-radius': {
        property: 'total',
        stops: generateSizeStops([
          [-1, 2],
          [1, 3],
          [3, 3.5],
          [10, 4],
          [30, 4.5],
          [100, 5.5],
          [300, 7],
          [600, 10],
          [1000, 13],
          [2000, 16],
          [3000, 20],
          [4000, 25],
          [7000, 30],
          [10000, 35],
          [15000, 40],
        ], _initialZoom),
      },
      'circle-color': {
        property: 'total',
        stops: [
          [-1, colors.unknown],
          [0, colors.low],
          [40, colors.medium],
          [250, colors.high],
          [1250, colors.severe],
        ],
      },
      'circle-opacity': 0.75,
    }

    this._map = null
    this.Mapbox = ReactMapboxGl({
      accessToken,
      scrollZoom: false,
      dragPan: props.dragPan,
    })
  }

  handleMapLoaded = (map) => {
    this._map = map
    const { onClickFeature, onEnterFeature, onLeaveFeature } = this.props
    map.on('click', 'features', (e) => {
      onClickFeature(e.features[0])
    })

    map.on('mousemove', 'features', (e) => {
      // change the cursor style as a ui indicator
      map.getCanvas().style.cursor = 'pointer' // eslint-disable-line no-param-reassign
      onEnterFeature(e.features[0])
    })

    map.on('mouseleave', 'features', () => {
      map.getCanvas().style.cursor = '' // eslint-disable-line no-param-reassign
      onLeaveFeature()
    })
  }

  render() {
    const {
      popup,
      filter,
      features,
      sourceLayer,
      sourceOptions,
      fitBounds,
      zoomControl,
    } = this.props
    const featureSourceOptions = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    }

    if (!_.isEqual(fitBounds, this._fitBounds)) this._fitBounds = fitBounds
    const { Mapbox } = this
    if (!Mapbox) return null

    return (
      <Mapbox
        style="mapbox://styles/kylebebak/cj95wutp2hbr22smynacs9gnk" // eslint-disable-line react/style-prop-object
        zoom={this._initialZoom}
        center={this._initialCoordinates}
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
        onStyleLoad={this.handleMapLoaded}
        fitBounds={this._fitBounds}
        fitBoundsOptions={this._fitBoundsOptions}
      >
        {popup}
        {zoomControl && <ZoomControl style={zoomStyle} className={Styles.zoomControlContainer} />}
        <Source
          id="features"
          geoJsonSource={features ? featureSourceOptions : sourceOptions}
        />
        <Layer
          id="features"
          sourceId="features"
          type="circle"
          sourceLayer={sourceLayer}
          filter={filter}
          paint={this._layerPaint}
        />
      </Mapbox>
    )
  }
}

LocalityDamageMap.propTypes = {
  dragPan: PropTypes.bool,
  features: PropTypes.arrayOf(PropTypes.object),
  sourceLayer: PropTypes.string,
  sourceOptions: PropTypes.object,
  filter: PropTypes.arrayOf(PropTypes.any),
  fitBounds: PropTypes.arrayOf(PropTypes.array),
  fitBoundsOptions: PropTypes.object,
  popup: PropTypes.any,
  onClickFeature: PropTypes.func,
  onEnterFeature: PropTypes.func,
  onLeaveFeature: PropTypes.func,
  zoomControl: PropTypes.bool,
  initialZoom: PropTypes.number,
}

LocalityDamageMap.defaultProps = {
  dragPan: true,
  zoomControl: true,
  onClickFeature: () => {},
  onEnterFeature: () => {},
  onLeaveFeature: () => {},
}

export default LocalityDamageMap
