/* eslint-disable camelcase */
import sendToApi from './request'
import { stringify } from './queryString'


const _stringify = (params) => {
  const s = stringify(params)
  return s ? `?${s}` : ''
}

const service = {
  getLocalityActions: async (locality_id, page_size = 250) => {
    const params = { locality_id, page_size }
    return sendToApi(`actions/${_stringify(params)}`)
  },

  getLocalityEstablishments: async (locality_id, page_size = 250) => {
    const params = { locality_id, page_size, is_categorized: true }
    return sendToApi(`establishments/${_stringify(params)}`)
  },

  getLocality: async (id) => {
    return sendToApi(`localities/${id}/`)
  },

  getLocalityByCvegeo: async (cvegeo) => {
    const params = { cvegeo }
    return sendToApi(`localities/${_stringify(params)}`)
  },
}

/**
 * Function that can be called by smart components to fetch data, and back off
 * exponentially if fetch throws an exception. Accepts a `self` argument, which
 * must be the component's `this`.
 */
export const getBackoff = async (...args) => {
  let count = 0
  let delay = 1000
  const inner = async (self, stateKey, getter, ...getterArgs) => {
    const { data, error, exception } = await getter(...getterArgs)
    if (data) self.setState({ [stateKey]: { loading: false, data, error: undefined } })
    if (error) self.setState({ [stateKey]: { loading: false, error } })
    if (exception && self._mounted) {
      setTimeout(() => inner(self, stateKey, getter, ...getterArgs), delay)
      if (count < 4) delay *= 2
      count += 1
    }
  }
  inner(...args)
}

export default service
