import 'whatwg-fetch'

import env from 'src/env'
import { store } from 'src/App'
import * as Actions from 'src/actions'
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

  return fetch(`${_url}${toQueryString(params)}`, options)
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
  const loginUrlByType = { org: 'cuenta', donor: 'donador' }

  try {
    const r = await _sendToApi(url, { ...params, token })
    const { status } = r
    if (status === 204) return { data: {} }

    const data = await r.json()
    if (status === 403 && data.detail === 'invalid_token') {
      Actions.authUnset(store.dispatch, { type })
      window.location.href = `${env.siteUrl}${loginUrlByType[type]}`
    }
    if (status >= 400) return { error: data, status }
    return { data, status }
  } catch (exception) {
    return { exception }
  }
}

export default sendToApi
export { sendToApiAuth }
