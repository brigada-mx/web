import React from 'react'
import PropTypes from 'prop-types'

import ReactMapboxGl, { Layer, Source, ZoomControl } from 'react-mapbox-gl'

import LocalityPopup from './LocalityPopup'


const Mapbox = ReactMapboxGl({
  accessToken: 'pk.eyJ1Ijoia3lsZWJlYmFrIiwiYSI6ImNqOTV2emYzdjIxbXEyd3A2Ynd2d2s0dG4ifQ.W9vKUEkm1KtmR66z_dhixA',
  scrollZoom: false,
})

class Map extends React.Component {
  constructor(props) {
    super(props)
    this.initialZoom = [6]
    this.initialCoordinates = [-95.9042505, 17.1073688]
    this.loaded = false
    this.state = {
      popup: null,
    }
  }

  damageGrade = (feature) => {
    const levels = [
      [10, 'minimal'],
      [50, 'low'],
      [250, 'medium'],
      [1250, 'high'],
      [Number.MAX_SAFE_INTEGER, 'severe'],
    ]
    const { total } = feature.properties
    if (total === undefined || total === null || total === '' || total === -1) {
      return 'unknown'
    }
    for (const l of levels) {
      if (total < l[0]) {
        return l[1]
      }
    }
    return 'unknown'
  }

  /**
   * Comparator for localities `a` and `b`, which assigns greater priority to
   * localities with high "marginación social" and many damaged buildings.
   */
  compareLocalities = (a, b) => {
    const { total: ta } = a.properties
    const { total: tb } = b.properties
    const [fa, fb] = [parseFloat(ta), parseFloat(tb)]
    if (Number.isNaN(fa)) {
      if (Number.isNaN(fb)) return 0
      return 1
    } else if (Number.isNaN(fb)) return -1
    return fb - fa
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
   * This is called only once, when data is first loaded from layer.
   */
  handleData = (map, e) => {
    if (this.props.localities.length > 0) {
      if (this.loaded) return
      this.loaded = true
    }

    if (e.dataType === 'source' && e.isSourceLoaded) {
      const features = map.querySourceFeatures('features', { sourceLayer: 'estados-15nov-5qk3g7' })
      const localities = this.deduplicate(features, 'cvegeo')
      localities.sort(this.compareLocalities)
      for (const l of localities) {
        l.properties.dmgGrade = this.damageGrade(l)

        l.properties.cvegeoS = l.properties.cvegeo.toString()

        l.properties.cvegeoMuni = l.properties.cvegeoS.substring(0, 5)
        l.properties.cvegeoState = l.properties.cvegeoS.substring(0, 2)
      }
      this.props.onLoad(localities)
    }
  }

  handleMapLoaded = (map) => {
    map.on('mousemove', 'features', (e) => {
      // change the cursor style as a ui indicator
      map.getCanvas().style.cursor = 'pointer' // eslint-disable-line no-param-reassign

      // populate the popup and set its coordinates based on the feature
      this.setState({ popup: e.features[0] })
    })

    map.on('mouseleave', 'features', () => {
      map.getCanvas().style.cursor = '' // eslint-disable-line no-param-reassign
      this.setState({ popup: null })
    })

    map.on('click', 'features', (e) => {
      this.props.onClickFeature(e.features[0])
    })
  }

  render() {
    const sourceOptions = {
      type: 'vector',
      url: 'mapbox://kylebebak.a71mofbc',
    }

    const { popup } = this.state

    return (
      <Mapbox
        style="mapbox://styles/kylebebak/cj95wutp2hbr22smynacs9gnk" // eslint-disable-line react/style-prop-object
        zoom={this.initialZoom}
        center={this.initialCoordinates}
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
        onData={this.handleData}
        onStyleLoad={this.handleMapLoaded}
      >
        {popup && <LocalityPopup locality={popup} />}
        <ZoomControl position="top-left" />
        <Source id="features" geoJsonSource={sourceOptions} />
        <Layer
          id="features"
          sourceId="features"
          type="circle"
          sourceLayer="estados-15nov-5qk3g7"
          filter={['in', 'cvegeo'].concat(
            this.props.localities.map((l) => {
              return l.properties.cvegeo
            })
          )}
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
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onLoad: PropTypes.func.isRequired,
  onClickFeature: PropTypes.func,
}

Map.defaultProps = {
  onClickFeature: () => {},
}

export default Map
