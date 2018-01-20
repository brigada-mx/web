/* eslint-disable camelcase */
import env from 'src/env'
import sendToApi from './request'


const apiUrlFake = 'https://s3-us-west-2.amazonaws.com/719s/test-data/'

class Service {
  constructor({ fake = false } = {}) {
    this.fake = process.env.FAKE_API === 'true' || (env.env === 'dev' && fake)
  }

  getLocalityActions = async (locality_id, page_size = 250) => {
    if (this.fake) return sendToApi(`${apiUrlFake}actions.json`, { isRelative: false })

    const params = { locality_id, page_size }
    return sendToApi('actions/', { params })
  }

  getLocalityEstablishments = async (locality_id, page_size = 250) => {
    if (this.fake) return sendToApi(`${apiUrlFake}establishments.json`, { isRelative: false })

    const params = { locality_id, page_size, is_categorized: true }
    return sendToApi('establishments/', { params })
  }

  getLocality = async (id) => {
    if (this.fake) return sendToApi(`${apiUrlFake}locality.json`, { isRelative: false })

    return sendToApi(`localities/${id}/`)
  }

  getLocalities = async (page_size = 250) => {
    const params = { has_data: true, page_size }
    return sendToApi('localities/', { params })
  }

  getLocalitiesStatic = async () => {
    return sendToApi(
      'https://s3-us-west-2.amazonaws.com/719s/data/localities.json', { isRelative: false }
    )
  }

  getOrganizations = async (page_size = 50) => {
    if (this.fake) return sendToApi(`${apiUrlFake}organizations.json`, { isRelative: false })

    const params = { page_size }
    return sendToApi('organizations/', { params })
  }

  getOrganization = async (id) => {
    if (this.fake) return sendToApi(`${apiUrlFake}organization.json`, { isRelative: false })

    return sendToApi(`organizations/${id}/`)
  }

  getAction = async (id) => {
    if (this.fake) return sendToApi(`${apiUrlFake}action.json`, { isRelative: false })

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
