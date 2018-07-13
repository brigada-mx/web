import React from 'react'
import PropTypes from 'prop-types'

import colors from 'src/colors'
import { generateSizeStops } from 'tools/other'
import FeatureMap from 'components/FeatureMap'


class LocalityDamageMap extends React.Component {
  constructor(props) {
    super(props)
    this._initialZoom = props.initialZoom || 6

    this._layer = {
      type: 'circle',
      paint: {
        'circle-radius': {
          property: 'total',
          stops: generateSizeStops([
            [-1, 4],
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
          ], this._initialZoom),
        },
        'circle-color': {
          property: 'total',
          stops: [
            [-1, colors.unknown],
            [0, colors.low],
            [40, colors.medium],
            [250, colors.high],
            [1250, colors.severe],
          ],
        },
        'circle-opacity': 0.75,
      },
    }
  }

  render() {
    const { features, sourceId = 'damage', ...rest } = this.props

    return (
      <FeatureMap
        features={this.props.features}
        initialZoom={this._initialZoom}
        layer={this._layer}
        sourceId={sourceId}
        {...rest}
      />
    )
  }
}

LocalityDamageMap.propTypes = {
  features: PropTypes.arrayOf(PropTypes.object),
  sourceId: PropTypes.string,
  initialZoom: PropTypes.number,
}

export default LocalityDamageMap
