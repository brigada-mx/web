export const toLowerWords = text => (text || '')
  .toLowerCase()
  .replace(/[^\s0-9a-z]/gi, '')
  .split(/\s+/g)
  .filter(x => x.length > 0)

const cleanAccentedChars = (s) => {
  let _s = s.replace(/[áÁ]/g, 'a')
  _s = _s.replace(/[éÉ]/g, 'e')
  _s = _s.replace(/[íÍ]/g, 'i')
  _s = _s.replace(/[ñÑ]/g, 'n')
  _s = _s.replace(/[óÓ]/g, 'o')
  _s = _s.replace(/[úÚüÜ]/g, 'u')
  return _s
}

export const tokenMatch = (h, n) => {
  const needles = toLowerWords(cleanAccentedChars(n))
  const haystack = toLowerWords(cleanAccentedChars(h))

  outer:
  for (const needle of needles) {
    for (let i = 0, l = haystack.length; i < l; i += 1) {
      if (haystack[i].indexOf(needle) >= 0) {
        haystack.splice(i, 1)
        continue outer
      }
    }
    return false
  }
  return true
}

export const fmtNum = (num) => {
  if (num === -1 || num === undefined || num === null || num === '') return '-'
  return num.toLocaleString()
}
