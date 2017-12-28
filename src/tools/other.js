import Colors from 'src/colors'


export const dmgGrade = (locality) => {
  const levels = [
    [10, 'minimal'],
    [50, 'low'],
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
    minimal: { label: 'MÍNIMO', labelFem: 'MÍNIMA', color: Colors.minimal },
    unknown: { label: 'SIN DATOS', labelFem: 'SIN DATOS', color: Colors.unknown },
  }
  return lookup[grade] || lookup.unknown
}
