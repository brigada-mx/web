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

  render() {
    const {
      popup,
      features = [],
      onClickFeature,
      onEnterFeature,
      onLeaveFeature,
      coordinates,
    } = this.props

    const markers = features.map((f) => {
      const { location: { lat, lng } } = f
      return (
        <Feature
          key={f.denue_id}
          coordinates={[lng, lat]}
          onClick={() => onClickFeature(f)}
          onMouseEnter={() => onEnterFeature(f)}
          onMouseLeave={() => onLeaveFeature(f)}
          properties={{}}
        />
      )
    })

    return (
      <Mapbox
        style="mapbox://styles/kylebebak/cj95wutp2hbr22smynacs9gnk" // eslint-disable-line react/style-prop-object
        zoom={this.initialZoom}
        center={coordinates}
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
      >
        {popup}
        <Layer
          type="symbol"
          id="marker"
          layout={{
            'icon-image': 'marker-15',
            'icon-allow-overlap': true,
            'icon-size': 1.5,
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
