import React from 'react'
import PropTypes from 'prop-types'

import ReactMapboxGl, { ZoomControl } from 'react-mapbox-gl'
import _ from 'lodash'

import env from 'src/env'
import EstablishmentLegend, { metaByScianGroup } from './EstablishmentLegend'
import Styles from './FeatureMap.css'


const { mapbox: { accessToken } } = env
const Mapbox = ReactMapboxGl({
  accessToken,
  scrollZoom: false,
})

const zoomStyle = {
  position: 'absolute',
  top: 26,
  left: 26,
  border: 'none',
  borderRadius: 2,
}

class FeatureMap extends React.Component {
  constructor(props) {
    super(props)
    this._initialZoom = [13]
    this._initialCoordinates = props.coordinates
    this._loaded = false
    this.state = {
      map: null,
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { map } = nextState
    if (!map) return

    const { features = [] } = nextProps
    if (this._loaded && _.isEqual(features, this.props.features)) return
    this._loaded = true

    const markers = features.map((f) => {
      const { scian_group: group, location: { lat, lng } } = f
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

    map.getSource('features').setData({
      type: 'FeatureCollection',
      features: markers,
    })
  }

  handleMapLoaded = (map) => {
    const { onClickFeature, onEnterFeature, onLeaveFeature } = this.props

    map.addSource('features', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })

    map.addLayer({
      id: 'features',
      type: 'symbol',
      source: 'features',
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

    this.setState({ map })
  }

  render() {
    const { popup, features } = this.props

    return (
      <Mapbox
        style="mapbox://styles/kylebebak/cjbr1wz8o7blj2rpbidkjujq2" // eslint-disable-line react/style-prop-object
        zoom={this._initialZoom}
        center={this._initialCoordinates}
        containerStyle={{
          height: '100%',
          width: '100%',
          position: 'relative',
        }}
        onStyleLoad={this.handleMapLoaded}
      >
        {popup}
        <EstablishmentLegend establishments={features} />
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
