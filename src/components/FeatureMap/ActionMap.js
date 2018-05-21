import React from 'react'
import PropTypes from 'prop-types'

import { fitBoundsFromCoords, distanceKmBetweenCoords } from 'tools/other'
import FeatureMap from './FeatureMap'
import ActionLegend from './ActionLegend'


const maxMetersGroupSubmissions = 50
const maxFeatures = 1000
const layer = {
  type: 'circle',
  paint: {
    'circle-color': {
      property: 'selected',
      type: 'categorical',
      stops: [
        [true, '#288968'],
        [false, '#3DC59F'],
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
const fitBoundsOptions = { padding: 50, maxZoom: 11 }

const ActionMap = ({ actions, selectedId, selectedLat, selectedLng, sourceId = 'actions', ...rest }) => {
  const selectedActions = actions.filter(a => a.id === selectedId)
  const notSelectedActions = actions.filter(a => a.id !== selectedId)
  const features = []
  const locations = []

  for (const a of selectedActions.concat(notSelectedActions)) {
    for (const s of a.submissions) {
      if (!s.location) continue
      if (s.images.length === 0) continue // don't add submissions with no files
      locations.push(s.location)

      const { lat, lng } = s.location
      let selected = a.id === selectedId
      if (!selected && lat !== undefined && lng !== undefined
        && selectedLat !== undefined && selectedLng !== undefined
      ) {
        selected = distanceKmBetweenCoords(lat, lng, selectedLat, selectedLng) * 1000 < maxMetersGroupSubmissions
      }

      features.push({
        type: 'Feature',
        properties: { action: a, selected, lng, lat, actionId: a.id },
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
      zoomControl={locations.length > 0}
      disableKeyboard
      fitBounds={fitBounds.length > 0 ? fitBounds : undefined}
      fitBoundsOptions={fitBoundsOptions}
      features={features.splice(0, maxFeatures)}
      layer={layer}
      sourceId={sourceId}
      legend={<ActionLegend />}
    />
  )
}

ActionMap.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  sourceId: PropTypes.string,
  selectedId: PropTypes.number,
  selectedLat: PropTypes.number,
  selectedLng: PropTypes.number,
  legend: PropTypes.string,
}

export default ActionMap
