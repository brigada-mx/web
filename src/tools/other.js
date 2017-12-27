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
    unknown: { label: 'SIN DATOS', labelFem: 'SIN DATOS', color: '#939AA1' },
    minimal: { label: 'MÍNIMO', labelFem: 'MÍNIMA', color: '#ff0' },
    low: { label: 'MENOR', labelFem: 'MENOR', color: '#db0' },
    medium: { label: 'MEDIO', labelFem: 'MEDIA', color: '#d80' },
    high: { label: 'GRAVE', labelFem: 'GRAVE', color: '#d40' },
    severe: { label: 'MUY GRAVE', labelFem: 'MUY GRAVE', color: '#f00' },
  }
  return lookup[grade] || lookup.unknown
}
