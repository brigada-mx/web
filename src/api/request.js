import 'whatwg-fetch'

import env from 'src/env'


const replaceProtocol = (url, protocol) => {
  const parts = url.split('://')
  return `${protocol}://${parts[1]}`
}

const _sendToApi = async (_url = '', { method = 'GET', body = {}, _headers = {}, isRelative = true } = {}) => {
  let url = _url
  const headers = {
    ..._headers,
    'Content-Type': 'application/json',
  }

  const request = {
    method,
    body: JSON.stringify(body), // `body` must be a string, not an object
    headers: new Headers(headers),
  }

  if (['GET', 'HEAD'].indexOf(method) > -1) { delete request.body }

  if (isRelative) {
    url = `${env.apiUrl}${url}`
  } else {
    url = replaceProtocol(url, env.urlProtocol)
  }
  return fetch(url, request)
}

/**
 * Guarantees that object returned has exactly one of `data`, `error`, and
 * `exception` keys.
 */
const sendToApi = async (...args) => {
  try {
    const r = await _sendToApi(...args)
    if (r.status >= 400) return { error: r }

    const data = await r.json()
    return { data }
  } catch (exception) {
    return { exception }
  }
}

export default sendToApi
