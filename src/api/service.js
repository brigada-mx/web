/* eslint-disable camelcase */
import env from 'src/env'
import { store } from 'src/App'
import * as Actions from 'src/actions'
import sendToApi, { sendToApiAuth } from './request'


class Service {
  constructor({ fakeUrl = '' } = {}) {
    this.fakeUrl = env.env === 'dev' && fakeUrl
  }

  // PUBLIC ENDPOINTS
  getLocalityActions = async (locality_id, page_size = 250) => {
    const params = { locality_id, page_size }
    return sendToApi('actions/', { params })
  }

  getLocalityEstablishments = async (locality_id, page_size = 250) => {
    const params = { locality_id, page_size, is_categorized: true }
    return sendToApi('establishments/', { params })
  }

  getLocality = async (id) => {
    return sendToApi(`localities/${id}/`)
  }

  getLocalities = async (page_size = 10000) => {
    const params = { page_size }
    return sendToApi('localities/', { params })
  }

  getLocalitiesSearch = async (search, page_size = 50, has_data) => {
    const params = { search, has_data, page_size }
    return sendToApi('localities_search/', { params })
  }

  getOrganizations = async (page_size = 1000) => {
    const params = { page_size }
    return sendToApi('organizations/', { params })
  }

  getOrganization = async (id) => {
    return sendToApi(`organizations/${id}/`)
  }

  getAction = async (id) => {
    return sendToApi(`actions/${id}/`)
  }

  getDonors = async (page_size = 10000) => {
    const params = { page_size }
    return sendToApi('donors/', { params })
  }

  // ORGANIZATION ACCOUNT PUBLIC ENDPOINTS
  sendSetPasswordEmail = async (email) => {
    return sendToApi('account/send_set_password_email/', { method: 'POST', body: { email } })
  }

  setPasswordWithToken = async (token, password) => {
    return sendToApi('account/set_password_with_token/', { method: 'POST', body: { token, password } })
  }

  token = async (email, password) => {
    return sendToApi('account/token/', { method: 'POST', body: { email, password } })
  }

  // ORGANIZATION ACCOUNT PROTECTED ENDPOINTS
  deleteToken = async () => {
    return sendToApiAuth('account/delete_token/', { method: 'POST' })
  }

  setPassword = async (old_password, password) => {
    return sendToApiAuth('account/set_password/', { method: 'POST', body: { old_password, password } })
  }

  getMe = async () => {
    return sendToApiAuth('account/me/')
  }

  updateMe = async (body) => {
    return sendToApiAuth('account/me/', { method: 'PUT', body })
  }

  getAccountOrganization = async () => {
    return sendToApiAuth('account/organization/')
  }

  getAccountActions = async (archived = false, page_size = 250) => {
    const params = { archived, page_size }
    return sendToApiAuth('account/actions/', { params })
  }

  getAccountActionsMinimal = async (archived = false, page_size = 250) => {
    const params = { archived, page_size }
    return sendToApiAuth('account/actions/', { ...params, fields: 'id,action_type,desc,key' })
  }

  getAccountSubmissions = async (has_action = false, archived = false, page_size = 250) => {
    const params = { has_action, archived, page_size }
    return sendToApiAuth('account/submissions/', { params })
  }

  getAccountSubmission = async (id) => {
    return sendToApiAuth(`account/submissions/${id}`)
  }

  getAccountAction = async (key) => {
    return sendToApiAuth(`account/actions_by_key/${key}/`)
  }

  resetAccountKey = async () => {
    return sendToApiAuth('account/organization/reset_key/', { method: 'POST' })
  }

  updateAccountOrganization = async (body) => {
    return sendToApiAuth('account/organization/', { method: 'PUT', body })
  }

  createAccountAction = async (body) => {
    return sendToApiAuth('account/actions/', { method: 'POST', body })
  }

  updateAccountAction = async (id, body) => {
    return sendToApiAuth(`account/actions/${id}/`, { method: 'PUT', body })
  }

  updateAccountSubmission = async (id, body) => {
    return sendToApiAuth(`account/submissions/${id}/`, { method: 'PUT', body })
  }

  createAccountDonation = async (body) => {
    return sendToApiAuth('account/donations/', { method: 'POST', body })
  }

  updateAccountDonation = async (id, body) => {
    return sendToApiAuth(`account/donations/${id}/`, { method: 'PUT', body })
  }

  deleteAccountDonation = async (id) => {
    return sendToApiAuth(`account/donations/${id}/`, { method: 'DELETE' })
  }

  archiveAccountAction = async (id, archived) => {
    const body = { archived }
    return sendToApiAuth(`account/actions/${id}/archive/`, { method: 'POST', body })
  }

  archiveAccountSubmission = async (id, archived) => {
    const body = { archived }
    return sendToApiAuth(`account/submissions/${id}/archive/`, { method: 'POST', body })
  }
}

/**
 * Fetches data. Throws results into Redux and/or passes them to `onResponse`.
 * Backs of exponentially if fetch throws exception.
 */
export const getBackoff = async (...args) => {
  let count = 0
  let delay = 1000
  const inner = async (getter, { onResponse, key }) => {
    const response = await getter()
    if (onResponse) onResponse(response)
    if (key) Actions.getter(store.dispatch, { response, key })

    if (response.exception) {
      if (count >= 4) return
      setTimeout(() => inner(getter, { onResponse, key }), delay)
      delay *= 2
      count += 1
    }
  }
  inner(...args)
}

/**
 * Called by smart components to fetch data, and back off exponentially if fetch
 * throws exception. Accepts a `self` argument, which must be component's `this`.
 */
export const getBackoffComponent = async (...args) => {
  let count = 0
  let delay = 1000
  const inner = async (self, stateKey, getter, onResponse) => {
    const { data, error, exception } = await getter()
    if (onResponse) onResponse({ data, error, exception })

    if (data) self.setState({ [stateKey]: { loading: false, data, error: undefined } })
    if (error) self.setState({ [stateKey]: { loading: false, error } })
    if (exception && self._mounted) {
      setTimeout(() => inner(self, stateKey, getter, onResponse), delay)
      if (count < 4) delay *= 2
      count += 1
    }
  }
  inner(...args)
}

export default new Service()
export { Service }
