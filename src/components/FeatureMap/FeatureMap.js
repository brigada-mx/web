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
    this._fitBounds = props.fitBounds
    this._fitBoundsOptions = props.fitBoundsOptions || { padding: 20 }
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
      const meta = metaByScianGroup[group]
      return {
        type: 'Feature',
        properties: {
          group, icon: meta ? meta.icon : metaByScianGroup[1].icon, f,
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
      // type: 'symbol',
      type: 'circle',
      source: 'features',
      // layout: {
      //   'icon-image': '{icon}',
      //   'icon-allow-overlap': true,
      // },
      paint: {
        'circle-color': {
          property: 'group',
          type: 'categorical',
          stops: [
            [1, '#2965CC'],
            [2, '#29A634'],
            [3, '#D99E0B'],
            [4, '#D13913'],
            [5, '#8F398F'],
            [6, '#00B3A4'],
            [7, '#DB2C6F'],
            [8, '#9BBF30'],
            [9, '#96622D'],
            [10, '#7157D9'],
          ],
        },
        'circle-opacity': 0.85,
        'circle-radius': 4,
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
    const { popup, features, fitBounds } = this.props
    if (!_.isEqual(fitBounds, this._fitBounds)) this._fitBounds = fitBounds

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
        fitBounds={this._fitBounds}
        fitBoundsOptions={this._fitBoundsOptions}
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
  fitBounds: PropTypes.arrayOf(PropTypes.array),
  fitBoundsOptions: PropTypes.object,
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
