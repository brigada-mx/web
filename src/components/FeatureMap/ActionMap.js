import React from 'react'
import PropTypes from 'prop-types'

import { fitBoundsFromCoords, distanceKmBetweenCoords } from 'tools/other'
import FeatureMap from './FeatureMap'
import TextLegend from './TextLegend'


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

const ActionMap = ({
  actions, selectedId, selectedLat, selectedLng, sourceId = 'actions', includeTestimonials = false, ...rest
}) => {
  const selectedActions = actions.filter(a => a.id === selectedId)
  const notSelectedActions = actions.filter(a => a.id !== selectedId)
  const features = []
  const locations = []

  for (const a of selectedActions.concat(notSelectedActions)) {
    const items = a.submissions.filter(
      s => s.location && s.images.length > 0
    ).concat(includeTestimonials ? a.testimonials : [])

    for (const item of items) {
      const type = item.video ? 'video' : 'image'
      locations.push(item.location)

      const { lat, lng } = item.location
      let selected = a.id === selectedId
      if (!selected && lat !== undefined && lng !== undefined
        && selectedLat !== undefined && selectedLng !== undefined
      ) {
        selected = distanceKmBetweenCoords(lat, lng, selectedLat, selectedLng) * 1000 < maxMetersGroupSubmissions
      }

      const properties = { selected, lng, lat, actionId: a.id, type }
      if (type === 'video') properties.videoId = item.video.youtube_video_id

      features.push({
        type: 'Feature',
        properties, // avoid using object properties, ESPECIALLY large objects
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
      legend={<TextLegend text="FOTOS DE PROYECTOS" />}
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
  includeTestimonials: PropTypes.bool,
}

export default ActionMap
