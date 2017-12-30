import React from 'react'
import PropTypes from 'prop-types'

import ReactMapboxGl, { ZoomControl } from 'react-mapbox-gl'

import EstablishmentLegend, { metaByScianGroup } from './EstablishmentLegend'
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
    this.initialCoordinates = props.coordinates
    this.state = {
      scianGroups: new Set(),
    }
  }

  handleMapLoaded = (map) => {
    const { onClickFeature, onEnterFeature, onLeaveFeature, features = [] } = this.props

    const scianGroups = new Set()
    const markers = features.map((f) => {
      const { scian_group: group, location: { lat, lng } } = f
      scianGroups.add(group)
      return {
        type: 'Feature',
        properties: {
          icon: metaByScianGroup[group].icon || metaByScianGroup[1].icon, f,
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      }
    })
    this.setState({ scianGroups })

    map.addLayer({
      id: 'features',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: markers,
        },
      },
      layout: {
        'icon-image': '{icon}',
        'icon-allow-overlap': true,
      },
    })

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
    const { popup } = this.props
    const { scianGroups } = this.state

    return (
      <Mapbox
        style="mapbox://styles/kylebebak/cjbr1wz8o7blj2rpbidkjujq2" // eslint-disable-line react/style-prop-object
        zoom={this.initialZoom}
        center={this.initialCoordinates}
        containerStyle={{
          height: '100%',
          width: '100%',
          position: 'relative',
        }}
        onStyleLoad={this.handleMapLoaded}
      >
        {popup}
        <EstablishmentLegend groups={Array.from(scianGroups)} />
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
