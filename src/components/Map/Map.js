import React from 'react'
import PropTypes from 'prop-types'

import ReactMapboxGl, { Layer, Source, ZoomControl } from 'react-mapbox-gl'

import Styles from './Map.css'


const Mapbox = ReactMapboxGl({
  accessToken: 'pk.eyJ1Ijoia3lsZWJlYmFrIiwiYSI6ImNqOTV2emYzdjIxbXEyd3A2Ynd2d2s0dG4ifQ.W9vKUEkm1KtmR66z_dhixA',
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
    this.initialZoom = [6]
    this.initialCoordinates = [-95.9042505, 17.1073688]
    this.loaded = false
  }

  deduplicate = (features, comparatorProperty) => {
    const existingFeatureKeys = {}
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    const uniqueFeatures = features.filter((el) => {
      if (existingFeatureKeys[el.properties[comparatorProperty]]) {
        return false
      }
      existingFeatureKeys[el.properties[comparatorProperty]] = true
      return true
    })

    return uniqueFeatures
  }

  /**
   * This is called only once, when data is first loaded.
   */
  handleData = (map, e) => {
    const { onLoad } = this.props
    if (e.dataType === 'source' && e.isSourceLoaded && onLoad) {
      const features = map.querySourceFeatures('features', { sourceLayer: 'tileset-2017-12-26-6oh1br' })
      if (this.loaded) return
      this.loaded = true
      onLoad(this.deduplicate(features, 'cvegeo'))
    }
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
    const sourceOptions = {
      type: 'vector',
      url: 'mapbox://kylebebak.3gkltrqb',
    }

    const { popup, cvegeoFilter } = this.props
    let filter
    if (cvegeoFilter) { // this is necessary because mapbox casts any valid string to an int
      filter = ['in', 'cvegeo'].concat(cvegeoFilter.map((v) => {
        if (v.startsWith('0')) return v
        return Number.parseInt(v, 10)
      }))
    }

    return (
      <Mapbox
        style="mapbox://styles/kylebebak/cjbr1wz8o7blj2rpbidkjujq2" // eslint-disable-line react/style-prop-object
        zoom={this.initialZoom}
        center={this.initialCoordinates}
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
        onData={this.handleData}
        onStyleLoad={this.handleMapLoaded}
      >
        {popup}
        <ZoomControl style={zoomStyle} className={Styles.zoomControlContainer} />
        <Source id="features" geoJsonSource={sourceOptions} />
        <Layer
          id="features"
          sourceId="features"
          type="circle"
          sourceLayer="tileset-2017-12-26-6oh1br"
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
                [-1, '#939AA1'],
                [0, '#ff0'],
                [10, '#db0'],
                [50, '#d80'],
                [250, '#d40'],
                [1250, '#f00'],
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
  cvegeoFilter: PropTypes.arrayOf(PropTypes.string), // for filtering localities
  popup: PropTypes.any,
  onLoad: PropTypes.func,
  onClickFeature: PropTypes.func,
  onEnterFeature: PropTypes.func,
  onLeaveFeature: PropTypes.func,
}

Map.defaultProps = {
  onLoad: () => {},
  onClickFeature: () => {},
  onEnterFeature: () => {},
  onLeaveFeature: () => {},
}

export default Map
