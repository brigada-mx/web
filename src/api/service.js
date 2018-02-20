/* eslint-disable camelcase */
import env from 'src/env'
import sendToApi from './request'


class Service {
  constructor({ fakeUrl = '' } = {}) {
    this.fakeUrl = env.env === 'dev' && fakeUrl
  }

  // PUBLIC ENDPOINTS
  getLocalityActions = async (locality_id, page_size = 250) => {
    if (this.fakeUrl) return sendToApi(`${this.fakeUrl}actions.json`, { isRelative: false })

    const params = { locality_id, page_size }
    return sendToApi('actions/', { params })
  }

  getLocalityEstablishments = async (locality_id, page_size = 250) => {
    if (this.fakeUrl) return sendToApi(`${this.fakeUrl}establishments.json`, { isRelative: false })

    const params = { locality_id, page_size, is_categorized: true }
    return sendToApi('establishments/', { params })
  }

  getLocality = async (id) => {
    if (this.fakeUrl) return sendToApi(`${this.fakeUrl}locality.json`, { isRelative: false })

    return sendToApi(`localities/${id}/`)
  }

  getLocalities = async (page_size = 10000) => {
    if (this.fakeUrl) return sendToApi(`${this.fakeUrl}localities.json`, { isRelative: false })

    const params = { page_size }
    return sendToApi('localities/', { params })
  }

  getOrganizations = async (page_size = 50) => {
    if (this.fakeUrl) return sendToApi(`${this.fakeUrl}organizations.json`, { isRelative: false })

    const params = { page_size }
    return sendToApi('organizations/', { params })
  }

  getOrganization = async (id) => {
    if (this.fakeUrl) return sendToApi(`${this.fakeUrl}organization.json`, { isRelative: false })

    return sendToApi(`organizations/${id}/`)
  }

  getAction = async (id) => {
    if (this.fakeUrl) return sendToApi(`${this.fakeUrl}action.json`, { isRelative: false })

    return sendToApi(`actions/${id}/`)
  }

  // ORGANIZATION ACCOUNT AUTH ENDPOINTS
  sendSetPasswordEmail = async (email) => {
    return sendToApi('account/send_set_password_email/', { method: 'POST', body: { email } })
  }

  setPasswordWithToken = async (token, password) => {
    return sendToApi('account/set_password_with_token/', { method: 'POST', body: { token, password } })
  }

  token = async (email, password) => {
    return sendToApi('account/token/', { method: 'POST', body: { email, password } })
  }

  setPassword = async (password) => {
    return sendToApi('account/set_password/', { method: 'POST', body: { password } })
  }

  deleteToken = async () => {
    return sendToApi('account/delete_token/', { method: 'POST' })
  }

  // ORGANIZATION ACCOUNT ENDPOINTS
  getAccountOrganization = async () => {
    return sendToApi('account/organization/')
  }

  getAccountActions = async (page_size = 250) => {
    const params = { page_size }
    return sendToApi('account/actions/', { params })
  }

  getAccountSubmissions = async (has_action = false, page_size = 250) => {
    const params = { has_action, page_size }
    return sendToApi('account/submissions/', { params })
  }

  getAccountAction = async (key) => {
    return sendToApi(`account/actions_by_key/${key}/`)
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
