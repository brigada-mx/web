/* @flow */
import React from 'react'

import fromPairs from 'lodash/fromPairs'
import partial from 'lodash/partial'
import split from 'lodash/split'
import urlRegex from 'url-regex'
import { Link } from 'react-router-dom'

import env from 'src/env'


export const roundTo = (number: number, places: number = 0): number => {
  const multiplier = 10 ** places
  return Math.round(number * multiplier) / multiplier
}

export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

export const parseQs = (qs: string): {} => {
  const parts = qs.replace('?', '').split('&').map(partial(split, partial.placeholder, '=', 2))
  return fromPairs(parts)
}

export const toLowerWords = (text: string): Array<string> => (text || '')
  .toLowerCase()
  .replace(/[^\s0-9a-z]/gi, '')
  .split(/\s+/g)
  .filter(x => x.length > 0)

export const cleanAccentedChars = (s: string): string => {
  let _s = s.replace(/[áÁ]/g, 'a')
  _s = _s.replace(/[éÉ]/g, 'e')
  _s = _s.replace(/[íÍ]/g, 'i')
  _s = _s.replace(/[ñÑ]/g, 'n')
  _s = _s.replace(/[óÓ]/g, 'o')
  _s = _s.replace(/[úÚüÜ]/g, 'u')
  return _s
}

export const tokenMatch = (h: string, n: string): boolean => {
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

export const fmtNum = (num: number): string => {
  if (num === -1 || num === undefined || num === null || num === '') return '-'
  return num.toLocaleString()
}

export const fmtBudgetPlain = (b: ?number): string => {
  if (!b) return '$'
  return `$${b.toLocaleString()}`
}

export const fmtBudget = (b: ?number): string => { // round to 1 or 0 decimal places
  if (!b) return '$'
  const millions = Math.round(b / 100000) / 10
  if (millions >= 100) return `$${Math.round(millions)}M`
  if (millions) return `$${millions}M`

  const thousands = Math.round(b / 1000)
  return `$${thousands}K`
}

export const cleanUrl = (url: string): string => {
  return url.replace(/["';<>]/g, '')
}

export const addProtocol = (url: string, protocol: string = 'http'): string => {
  const clean = cleanUrl(url)
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean
  return `${protocol}://${clean}`
}

export const phoneLink = (phone: string): string => {
  const clean = cleanUrl(phone)
  return `tel:${clean.replace(/\s/g, '')}`
}

export const emailLink = (email: string, subject: string): string => {
  const clean = cleanUrl(email)
  if (!subject) return `mailto:${clean}`
  return `mailto:${clean}?subject=${cleanUrl(subject)}`
}

export const truncate = (s: string, l: number): string => {
  if (s.length > l) {
    return `${s.substring(0, l).trim()}…`
  }
  return s
}

export const getLocation = (href: string): null | {
  href?: string,
  protocol?: string,
  host?: string,
  hostname?: string,
  port?: string,
  pathname?: string,
  search?: string,
  hash?: string,
} => {
  const match = href.match(/^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/) || null
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

export const thumborUrl = (
  { url, rotate: r = 0 }: { url: string, rotate?: number },
  width: number, height: number,
  { crop = false, rotate = true }: { crop: boolean, rotate: boolean } = {},
) => {
  const clean = addProtocol(url)
  const parsed = getLocation(clean)
  const rotateFilter = rotate ? `/filters:rotate(${-r * 90})` : ''
  return parsed && `${env.thumborUrl}/${crop ? '' : 'fit-in/'}${width}x${height}${rotateFilter}${parsed.pathname || ''}`
}

export const googleMapsUrl = (lat: number, lng: number) => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

export const imageStyleObject = ({ rotate = 0, hidden = false }: { rotate: number, hidden?: boolean }) => {
  return {
    transform: `rotate(${rotate * 90}deg)`,
    opacity: hidden ? 0.3 : 1,
  }
}


export const getTextWidth = (text: string, font: string): number => {
  // $FlowFixMe
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}

export const _renderLinks = (text: string, type: ?string) => {
  let remaining = text
  const parts = []
  while (true) { // eslint-disable-line no-constant-condition
    let match
    if (type === 'email') match = /\S+@\S+\.\S+/.exec(remaining)
    else match = urlRegex({ strict: false }).exec(remaining)

    if (match === null) {
      parts.push(remaining)
      break
    }
    parts.push(remaining.substring(0, match.index))
    let s = match[0]
    while ([',', '.', ':', ';'].includes(s.slice(-1))) {
      s = s.slice(0, -1)
    }

    if (type === 'email') parts.push(<a href={`mailto:${s}`}>{s}</a>)
    else {
      const url = addProtocol(s)
      const parsed = getLocation(url)
      const { host, pathname, search = '' } = parsed || {}
      if (host === env.siteHost) parts.push(<Link to={`${pathname || '/'}${search}`}>{s}</Link>)
      else parts.push(<a href={url} target="_blank" rel="noopener noreferrer">{s}</a>)
    }
    remaining = remaining.substring(match.index + s.length)
  }
  return parts
}

export const renderLinks = (text: string): Array<*> => {
  const emailParts = _renderLinks(text, 'email')
  const parts = [].concat(...emailParts.map((p) => {
    if (typeof p === 'string') return _renderLinks(p)
    return [p]
  }))
  return parts.map((p, i) => <React.Fragment key={i}>{p}</React.Fragment>)
}

export const formatBytes = (b: number): string => {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let l = 0
  let n = b

  while (n >= 1024) {
    n /= 1024
    l += 1
  }

  return `${n.toFixed(n >= 10 || l < 1 ? 0 : 1)}${units[l]}`
}

export const transparencyLabelByLevel = (level: number = 0): string => { // in response from `accountGetActionStrength`
  const labelByLevel = ['poco transparente', 'semi-transparente', 'transparente', 'transparente']
  return labelByLevel[Math.min(level, labelByLevel.length)]
}
