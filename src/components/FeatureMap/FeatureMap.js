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
    this.initialZoom = [9]
    this.initialCoordinates = [-95.9042505, 17.1073688]
  }

  render() {
    const { popup, features, onClickFeature, onEnterFeature, onLeaveFeature } = this.props

    return (
      <Mapbox
        style="mapbox://styles/kylebebak/cj95wutp2hbr22smynacs9gnk" // eslint-disable-line react/style-prop-object
        zoom={this.initialZoom}
        center={this.initialCoordinates}
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
      >
        {popup}
        <Layer
          type="symbol"
          id="marker"
          layout={{ 'icon-image': 'marker-15' }}
        >
          <Feature
            coordinates={[-95.9042505, 17.1073688]}
            onClick={onClickFeature}
            onMouseEnter={onEnterFeature}
            onMouseLeave={onLeaveFeature}
          />
          <Feature
            coordinates={[-95.9042505, 17.1573688]}
            onClick={onClickFeature}
            onMouseEnter={onEnterFeature}
            onMouseLeave={onLeaveFeature}
          />
        </Layer>
        <ZoomControl style={zoomStyle} className={Styles.zoomControlContainer} />
      </Mapbox>
    )
  }
}

FeatureMap.propTypes = {
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
