import moment from 'moment'

import Colors from 'src/colors'


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
    severe: { label: 'MUY GRAVE', labelFem: 'MUY GRAVE', color: Colors.severe },
    high: { label: 'GRAVE', labelFem: 'GRAVE', color: Colors.high },
    medium: { label: 'MEDIO', labelFem: 'MEDIA', color: Colors.medium },
    low: { label: 'MENOR', labelFem: 'MENOR', color: Colors.low },
    unknown: { label: 'SIN DATOS', labelFem: 'SIN DATOS', color: Colors.unknown },
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
