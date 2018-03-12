import React from 'react'
import PropTypes from 'prop-types'

import ReactMapboxGl, { ZoomControl } from 'react-mapbox-gl'
import _ from 'lodash'

import env from 'src/env'
import Styles from './FeatureMap.css'


const { mapbox: { accessToken } } = env

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
    this._initialZoom = [props.initialZoom || 13]
    this._initialCoordinates = props.coordinates || [-95.9042505, 17.1073688]
    this._fitBounds = props.fitBounds
    this._fitBoundsOptions = props.fitBoundsOptions || { padding: 20, maxZoom: 10 }
    this._loaded = false
    this.state = {
      map: null,
    }
    this.Mapbox = ReactMapboxGl({
      accessToken,
      scrollZoom: false,
      keyboard: !props.disableKeyboard,
      dragPan: props.dragPan,
    })
  }

  componentWillUpdate(nextProps, nextState) {
    const { map } = nextState
    if (!map) return

    const { features = [] } = nextProps
    if (this._loaded && _.isEqual(features, this.props.features)) return
    this._loaded = true

    map.getSource('features').setData({
      type: 'FeatureCollection',
      features,
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

    map.addLayer(this.props.layer)

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

    this.setState({ map })
  }

  render() {
    const { popup, legend, fitBounds } = this.props
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
          position: 'relative',
        }}
        onStyleLoad={this.handleMapLoaded}
        fitBounds={this._fitBounds}
        fitBoundsOptions={this._fitBoundsOptions}
      >
        {popup}
        {legend}
        <ZoomControl style={zoomStyle} className={Styles.zoomControlContainer} />
      </Mapbox>
    )
  }
}

FeatureMap.propTypes = {
  dragPan: PropTypes.bool,
  initialZoom: PropTypes.number,
  disableKeyboard: PropTypes.bool,
  coordinates: PropTypes.arrayOf(PropTypes.number),
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  layer: PropTypes.object.isRequired,
  fitBounds: PropTypes.arrayOf(PropTypes.array),
  fitBoundsOptions: PropTypes.object,
  popup: PropTypes.any,
  legend: PropTypes.any,
  onClickFeature: PropTypes.func,
  onEnterFeature: PropTypes.func,
  onLeaveFeature: PropTypes.func,
}

FeatureMap.defaultProps = {
  dragPan: true,
  disableKeyboard: false,
  onClickFeature: () => {},
  onEnterFeature: () => {},
  onLeaveFeature: () => {},
}

export default FeatureMap
