import moment from 'moment'
import ReactGA from 'react-ga'

import colors from 'src/colors'


export const itemFromScrollEvent = (e, items) => {
  const { scrollLeft, scrollWidth } = e.nativeEvent.srcElement
  const width = scrollWidth / items.length
  const index = Math.min(Math.max(
    Math.floor(scrollLeft / width + 0.5), 0),
  items.length - 1)
  return items[index]
}

export const projectStatus = (startDate, endDate) => {
  const date = moment().format('YYYY-MM-DD')
  if (startDate && date < startDate) return 0
  else if (!endDate || date <= endDate) return 1
  return 2
}

export const labelByProjectStatus = (status) => {
  return ['Por iniciar', 'En progreso', 'Completado'][status] || 'Desconocido'
}

export const dmgGrade = (locality) => {
  const levels = [
    [40, 'low'],
    [250, 'medium'],
    [1250, 'high'],
    [Number.MAX_SAFE_INTEGER, 'severe'],
  ]
  const { total } = locality.meta
  if (total === undefined || total === null || total === '' || total === -1) {
    return 'unknown'
  }
  for (const l of levels) {
    if (total < l[0]) {
      return l[1]
    }
  }
  return 'unknown'
}

export const metaByDmgGrade = (grade) => {
  const lookup = {
    severe: { label: 'MUY GRAVE', labelFem: 'MUY GRAVE', color: colors.severe },
    high: { label: 'GRAVE', labelFem: 'GRAVE', color: colors.high },
    medium: { label: 'MEDIO', labelFem: 'MEDIA', color: colors.medium },
    low: { label: 'MENOR', labelFem: 'MENOR', color: colors.low },
    unknown: { label: 'SIN DATOS', labelFem: 'SIN DATOS', color: colors.unknown },
  }
  return lookup[grade] || lookup.unknown
}

export const fitBoundsFromCoords = (coords) => {
  if (coords.length === 0) return []

  let minLat, maxLat, minLng, maxLng
  for (const c of coords) {
    const { lat, lng } = c
    if (minLat === undefined) {
      minLat = lat
      maxLat = lat
      minLng = lng
      maxLng = lng
    } else {
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
    }
  }
  return [[minLng, minLat], [maxLng, maxLat]]
}

const deg2rad = (deg) => {
  return deg * (Math.PI / 180)
}

export const distanceKmBetweenCoords = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLng = deg2rad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const generateSizeStops = (baseStops, baseZoom, minZoom = 3, maxZoom = 15) => {
  const stops = []
  for (let zoom = minZoom; zoom <= maxZoom; zoom += 1) {
    stops.push(baseStops.map((stop) => {
      const [value, size] = stop
      return [{ zoom, value }, size * (zoom / baseZoom) ** 1.25]
    }))
  }
  return [].concat(...stops)
}

export const toDegrees = (coordinate) => {
  const absolute = Math.abs(coordinate)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60)
  return [Math.sign(coordinate), degrees, minutes, seconds]
}

export const fireGaEvent = (category, action = null) => {
  ReactGA.event({
    category,
    action: action || window.location.pathname,
  })
}
