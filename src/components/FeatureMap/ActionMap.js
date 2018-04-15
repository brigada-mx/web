import React from 'react'
import PropTypes from 'prop-types'

import { fitBoundsFromCoords } from 'tools/other'
import FeatureMap from './FeatureMap'
import ActionLegend from './ActionLegend'


const maxFeatures = 1000
const layer = {
  id: 'features',
  type: 'circle',
  source: 'features',
  paint: {
    'circle-color': '#3DC59F',
    'circle-opacity': {
      property: 'selected',
      type: 'categorical',
      stops: [
        [true, 1],
        [false, 1],
      ],
    },
    'circle-radius': {
      property: 'selected',
      type: 'categorical',
      stops: [
        [true, 9],
        [false, 4],
      ],
    },
  },
}
const fitBoundsOptions = { padding: 50, maxZoom: 10 }

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
        properties: { action: a, selected: a.id === selectedId, lng, lat, actionId: a.id },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      })
    }
  }

  const fitBounds = fitBoundsFromCoords(locations)

  return (
    <FeatureMap
      {...rest}
      interactive={locations.length > 0}
      initialZoom={locations.length > 0 ? 13 : 5.5}
      zoom={locations.length > 0}
      disableKeyboard
      fitBounds={fitBounds.length > 0 ? fitBounds : undefined}
      fitBoundsOptions={fitBoundsOptions}
      features={features}
      layer={layer}
      legend={<ActionLegend />}
    />
  )
}

ActionMap.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedId: PropTypes.number,
  legend: PropTypes.string,
}

export default ActionMap
