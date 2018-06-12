import 'whatwg-fetch'

import env from 'src/env'
import { store } from 'src/App'
import * as Actions from 'src/actions'
import { stringify } from './queryString'


const toQs = (params, opts) => {
  const s = stringify(params, opts)
  return s ? `?${s}` : ''
}

const replaceProtocol = (url, protocol) => {
  const parts = url.split('://')
  return `${protocol}://${parts[1]}`
}

const _sendToUrl = async (url = '', { method = 'GET', body = {}, params = {}, headers = {} } = {}) => {
  const options = {
    method,
    body: JSON.stringify(body), // `body` must be a string, not an object
    headers: new Headers(headers),
  }

  if (['GET', 'HEAD'].indexOf(method) > -1) { delete options.body }

  return fetch(`${url}${toQs(params)}`, options)
}

const _sendToApi = async (
  url = '', { method = 'GET', body = {}, params = {}, headers = {}, isRelative = true, token = '' } = {}
) => {
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

  let _url = url
  if (isRelative) {
    _url = `${env.apiUrl}${_url}`
  } else {
    _url = replaceProtocol(_url, env.urlProtocol)
  }

  return fetch(`${_url}${toQs(params)}`, options)
}

/**
 * Guarantees that object returned has exactly one of `data`, `error`, and
 * `exception` keys.
 */
const sendToApi = async (url, params) => {
  try {
    const r = await _sendToApi(url, params)
    const { status } = r
    if (status === 204) return { data: {} }

    const data = await r.json()
    if (status >= 400) return { error: data, status }
    return { data, status }
  } catch (exception) {
    return { exception }
  }
}

const sendToApiAuth = async (type, url, params = {}) => {
  const { token } = store.getState().auth[type] || {}

  try {
    const r = await _sendToApi(url, { ...params, token })
    const { status } = r
    if (status === 204) return { data: {} }

    const data = await r.json()
    if (status === 403 && data.detail === 'invalid_token') {
      Actions.authUnset(store.dispatch, { type })
    }
    if (status >= 400) return { error: data, status }
    return { data, status }
  } catch (exception) {
    return { exception }
  }
}

const sendToUrl = async (url, params) => {
  try {
    const r = await _sendToUrl(url, params)
    const { status } = r

    const data = await r.json()
    if (status >= 400) return { error: data, status }
    return { data, status }
  } catch (exception) {
    return { exception }
  }
}

export default sendToApi
export { sendToApiAuth, sendToUrl, toQs }
