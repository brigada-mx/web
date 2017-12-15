import 'whatwg-fetch'

import env from 'src/env'


const replaceProtocol = (url, protocol) => {
  // `protocol` must be passed with trailing '//', so not exactly a protocol
  const parts = url.split('//')
  return protocol + parts[1]
}

const sendToApi = (_url = '', { method = 'GET', body = {}, _headers = {}, isRelative = true } = {}) => {
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

export default sendToApi
