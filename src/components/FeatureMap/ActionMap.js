import React from 'react'
import PropTypes from 'prop-types'

import Colors from 'src/Colors'
import { fitBoundsFromCoords } from 'tools/other'
import FeatureMap from './FeatureMap'
import Styles from './EstablishmentLegend.css'


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

const legend = () => {
  return (
    <div className={Styles.container}>
      <div className={Styles.legendItem}>
        <div>
          <span className={Styles.circle} style={{ backgroundColor: '#3DC59F' }} />
          <span className={Styles.label}>Fotos</span>
        </div>
      </div>
    </div>
  )
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
        properties: { action: a, selected: a.id === selectedId },
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
      disableKeyboard
      fitBounds={fitBoundsFromCoords(locations)}
      features={features}
      layer={layer}
      legend={legend}
    />
  )
}

ActionMap.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedId: PropTypes.number,
  legend: PropTypes.string,
}

export default ActionMap
