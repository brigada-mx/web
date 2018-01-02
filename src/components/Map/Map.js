import React from 'react'
import PropTypes from 'prop-types'

import ReactMapboxGl, { Layer, Source, ZoomControl } from 'react-mapbox-gl'

import env from 'src/env'
import Colors from 'src/Colors'
import Styles from './Map.css'


const { mapbox: { accessToken } } = env
const Mapbox = ReactMapboxGl({
  accessToken,
  scrollZoom: false,
})

const zoomStyle = {
  position: 'absolute',
  top: 26,
  right: 26,
  border: 'none',
  borderRadius: 2,
}

class Map extends React.Component {
  constructor(props) {
    super(props)
    this._initialZoom = [6]
    this._initialCoordinates = [-95.9042505, 17.1073688]
  }

  handleMapLoaded = (map) => {
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
    const { popup, filter, features, sourceLayer, sourceOptions } = this.props
    const featureSourceOptions = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    }

    return (
      <Mapbox
        style="mapbox://styles/kylebebak/cjbr1wz8o7blj2rpbidkjujq2" // eslint-disable-line react/style-prop-object
        zoom={this._initialZoom}
        center={this._initialCoordinates}
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
        onStyleLoad={this.handleMapLoaded}
      >
        {popup}
        <ZoomControl style={zoomStyle} className={Styles.zoomControlContainer} />
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
          paint={{
            'circle-radius': {
              property: 'total',
              stops: [
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
              ],
            },
            'circle-color': {
              property: 'total',
              stops: [
                [-1, Colors.unknown],
                [0, Colors.minimal],
                [10, Colors.low],
                [50, Colors.medium],
                [250, Colors.high],
                [1250, Colors.severe],
              ],
            },
            'circle-opacity': 0.75,
          }}
        />
      </Mapbox>
    )
  }
}

Map.propTypes = {
  features: PropTypes.arrayOf(PropTypes.object),
  sourceLayer: PropTypes.string,
  sourceOptions: PropTypes.object,
  filter: PropTypes.arrayOf(PropTypes.any),
  popup: PropTypes.any,
  onClickFeature: PropTypes.func,
  onEnterFeature: PropTypes.func,
  onLeaveFeature: PropTypes.func,
}

Map.defaultProps = {
  onClickFeature: () => {},
  onEnterFeature: () => {},
  onLeaveFeature: () => {},
}

export default Map
