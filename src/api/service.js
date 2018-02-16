/* eslint-disable camelcase */
import env from 'src/env'
import sendToApi from './request'


class Service {
  constructor({ fakeUrl = '' } = {}) {
    this.fakeUrl = env.env === 'dev' && fakeUrl
  }

  getLocalityActions = async (locality_id, page_size = 250) => {
    if (this.fakeUrl) return sendToApi(`${fakeUrl}actions.json`, { isRelative: false })

    const params = { locality_id, page_size }
    return sendToApi('actions/', { params })
  }

  getLocalityEstablishments = async (locality_id, page_size = 250) => {
    if (this.fakeUrl) return sendToApi(`${fakeUrl}establishments.json`, { isRelative: false })

    const params = { locality_id, page_size, is_categorized: true }
    return sendToApi('establishments/', { params })
  }

  getLocality = async (id) => {
    if (this.fakeUrl) return sendToApi(`${fakeUrl}locality.json`, { isRelative: false })

    return sendToApi(`localities/${id}/`)
  }

  getLocalities = async (page_size = 10000) => {
    if (this.fakeUrl) return sendToApi(`${fakeUrl}localities.json`, { isRelative: false })

    const params = { page_size }
    return sendToApi('localities_raw/', { params })
  }

  getOrganizations = async (page_size = 50) => {
    if (this.fakeUrl) return sendToApi(`${fakeUrl}organizations.json`, { isRelative: false })

    const params = { page_size }
    return sendToApi('organizations/', { params })
  }

  getOrganization = async (id) => {
    if (this.fakeUrl) return sendToApi(`${fakeUrl}organization.json`, { isRelative: false })

    return sendToApi(`organizations/${id}/`)
  }

  getAction = async (id) => {
    if (this.fakeUrl) return sendToApi(`${fakeUrl}action.json`, { isRelative: false })

    return sendToApi(`actions/${id}/`)
  }
}

/**
 * Function that can be called by smart components to fetch data, and back off
 * exponentially if fetch throws an exception. Accepts a `self` argument, which
 * must be component's `this`.
 */
export const getBackoff = async (...args) => {
  let count = 0
  let delay = 1000
  const inner = async (self, stateKey, getter, { onData, onError, onException } = {}) => {
    const { data, error, exception } = await getter()
    if (data) {
      if (onData) onData(data)
      self.setState({ [stateKey]: { loading: false, data, error: undefined } })
    }
    if (error) {
      if (onError) onError(error)
      self.setState({ [stateKey]: { loading: false, error } })
    }
    if (exception && self._mounted) {
      if (onException) onException(exception)
      setTimeout(() => inner(self, stateKey, getter, { onData, onError, onException }), delay)
      if (count < 4) delay *= 2
      count += 1
    }
  }
  inner(...args)
}

export const getBackoffStateless = async (...args) => {
  let count = 0
  let delay = 1000
  const inner = async (getter, onResponse) => {
    const { data, error, exception } = await getter()
    onResponse({ data, error, exception })

    if (exception) {
      setTimeout(() => inner(getter, onResponse), delay)
      if (count < 4) delay *= 2
      count += 1
    }
  }
  inner(...args)
}

export default new Service()
export { Service }
