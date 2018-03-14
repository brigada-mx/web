import _ from 'lodash'

import env from 'src/env'


export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

export const parseQs = (qs) => {
  return _.chain(qs)
    .replace('?', '')
    .split('&')
    .map(_.partial(_.split, _, '=', 2))
    .fromPairs()
    .value()
}

export const toLowerWords = text => (text || '')
  .toLowerCase()
  .replace(/[^\s0-9a-z]/gi, '')
  .split(/\s+/g)
  .filter(x => x.length > 0)

export const cleanAccentedChars = (s) => {
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

export const fmtBudgetPlain = (b) => {
  if (b !== 0 && !b) return '$'
  return `$${b.toLocaleString()}`
}

export const fmtBudget = (b) => { // round to 2 decimal places
  if (b !== 0 && !b) return '$'
  const millions = Math.round(b / 10000) / 100
  return `$${millions}M`
}

export const addProtocol = (url, protocol = 'http') => {
  if (url.startsWith('http://') || url.startsWith('http://')) return url
  return `${protocol}://${url}`
}

export const phoneLink = (phone) => {
  return `tel:${phone.replace(/\s/g, '')}`
}

export const emailLink = (email) => {
  return `mailto:${email}`
}

export const truncate = (s, l) => {
  if (s.length > l) {
    return `${s.substring(0, l).trim()}…`
  }
  return s
}

export const getLocation = (href) => {
  const match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/)
  return match && {
    href,
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7],
  }
}

export const thumborUrl = ({ url, datetime, transform }, width, height, crop = false) => {
  const parsed = getLocation(url)
  return parsed && `${env.thumborUrl}/${crop ? '' : 'fit-in/'}${width}x${height}${parsed.pathname}`
}
