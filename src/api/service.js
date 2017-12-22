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

export default service
