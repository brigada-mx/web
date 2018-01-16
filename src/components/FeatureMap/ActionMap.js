import React from 'react'
import PropTypes from 'prop-types'

import Colors from 'src/Colors'
import { fitBoundsFromCoords } from 'tools/other'
import FeatureMap from './FeatureMap'


const maxFeatures = 1000
const layer = {
  id: 'features',
  type: 'circle',
  source: 'features',
  paint: {
    'circle-color': Colors.brandGreen,
    'circle-opacity': {
      property: 'selected',
      type: 'categorical',
      stops: [
        [true, 1],
        [false, 0.75],
      ],
    },
    'circle-radius': {
      property: 'selected',
      type: 'categorical',
      stops: [
        [true, 9],
        [false, 5],
      ],
    },
  },
}

const ActionMap = ({ actions, selectedId, ...rest }) => {
  const selected = actions.filter(a => a.id === selectedId)
  const notSelected = actions.filter(a => a.id !== selectedId)
  const features = []
  const locations = []

  for (const a of selected.concat(notSelected)) {
    for (const s of a.submissions) {
      if (!s.location) continue
      locations.push(s.location) // fitBounds from all locations, but limit number of features
      if (features.length >= maxFeatures) continue

      const { lat, lng } = s.location
      features.push({
        type: 'Feature',
        properties: { actionId: a.id, selected: a.id === selectedId, s },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      })
    }
  }

  if (features.length === 0) return null
  return (
    <FeatureMap
      {...rest}
      fitBounds={fitBoundsFromCoords(locations)}
      features={features}
      layer={layer}
    />
  )
}

ActionMap.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedId: PropTypes.number,
}

export default ActionMap
