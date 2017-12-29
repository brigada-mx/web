import React from 'react'
import PropTypes from 'prop-types'

import ReactMapboxGl, { Layer, Feature, ZoomControl } from 'react-mapbox-gl'

import Styles from './FeatureMap.css'


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

class FeatureMap extends React.Component {
  constructor(props) {
    super(props)
    this.initialZoom = [13]
  }

  handleMapLoaded = (map) => {
    const { onClickFeature, onEnterFeature, onLeaveFeature } = this.props
    map.on('click', 'features', (e) => {
      onClickFeature(JSON.parse(e.features[0].properties.f))
    })

    map.on('mousemove', 'features', (e) => {
      // change the cursor style as a ui indicator
      map.getCanvas().style.cursor = 'pointer' // eslint-disable-line no-param-reassign
      onEnterFeature(JSON.parse(e.features[0].properties.f))
    })

    map.on('mouseleave', 'features', () => {
      map.getCanvas().style.cursor = '' // eslint-disable-line no-param-reassign
      onLeaveFeature()
    })
  }

  render() {
    const {
      popup,
      features = [],
      coordinates,
    } = this.props

    const iconByScianGroup = {
      1: 'doctor-15',
      2: 'dog-park-15',
      3: 'drinking-water-15',
      4: 'embassy-15',
      5: 'entrance-15',
      6: 'fast-food-15',
      7: 'ferry-15',
      8: 'fire-station-15',
      9: 'fuel-15',
      10: 'garden-15',
    }

    const markers = features.map((f) => {
      const { scian_group: group, location: { lat, lng } } = f
      return (
        <Feature
          key={f.denue_id}
          coordinates={[lng, lat]}
          properties={{ image: iconByScianGroup[group] || iconByScianGroup[1], f }}
        />
      )
    })

    return (
      <Mapbox
        style="mapbox://styles/kylebebak/cjbr1wz8o7blj2rpbidkjujq2" // eslint-disable-line react/style-prop-object
        zoom={this.initialZoom}
        center={coordinates}
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
        onStyleLoad={this.handleMapLoaded}
      >
        {popup}
        <Layer
          id="features"
          type="symbol"
          layout={{
            'icon-allow-overlap': true,
            'icon-image': '{image}',
          }}
        >
          {markers}
        </Layer>
        <ZoomControl style={zoomStyle} className={Styles.zoomControlContainer} />
      </Mapbox>
    )
  }
}

FeatureMap.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  popup: PropTypes.any,
  onClickFeature: PropTypes.func,
  onEnterFeature: PropTypes.func,
  onLeaveFeature: PropTypes.func,
}

FeatureMap.defaultProps = {
  onClickFeature: () => {},
  onEnterFeature: () => {},
  onLeaveFeature: () => {},
}

export default FeatureMap
