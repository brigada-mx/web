import 'whatwg-fetch'

import env from 'src/env'
import { stringify } from './queryString'


const toQueryString = (params) => {
  const s = stringify(params)
  return s ? `?${s}` : ''
}

const replaceProtocol = (url, protocol) => {
  const parts = url.split('://')
  return `${protocol}://${parts[1]}`
}

const _sendToApi = async (
  _url = '', { method = 'GET', body = {}, params = {}, headers = {}, isRelative = true, token } = {}
) => {
  let url = _url
  const _headers = {
    ...headers,
    'Content-Type': 'application/json',
  }
  if (token) _headers.Authorization = `Bearer ${token}`

  const options = {
    method,
    body: JSON.stringify(body), // `body` must be a string, not an object
    headers: new Headers(_headers),
  }

  if (['GET', 'HEAD'].indexOf(method) > -1) { delete options.body }

  if (isRelative) {
    url = `${env.apiUrl}${url}`
  } else {
    url = replaceProtocol(url, env.urlProtocol)
  }

  return fetch(`${url}${toQueryString(params)}`, options)
}

/**
 * Guarantees that object returned has exactly one of `data`, `error`, and
 * `exception` keys.
 */
const sendToApi = async (url, params) => {
  try {
    const r = await _sendToApi(url, params)
    if (r.status >= 400) return { error: r }

    const data = await r.json()
    return { data }
  } catch (exception) {
    return { exception }
  }
}

export default sendToApi
