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
    return sendToApi('/actions/', { params })
  }

  getLocalityEstablishments = async (locality_id, page_size = 250) => {
    const params = { locality_id, page_size, is_categorized: true }
    return sendToApi('/establishments/', { params })
  }

  getLocality = async (id) => {
    return sendToApi(`/localities/${id}/`)
  }

  getLocalities = async (page_size = 10000) => {
    const params = { page_size }
    return sendToApi('/localities/', { params })
  }

  getLocalitiesSearch = async (search, page_size = 50, has_data) => {
    const params = { search, has_data, page_size }
    return sendToApi('/localities_search/', { params })
  }

  getOrganizations = async (page_size = 1000) => {
    const params = { page_size }
    return sendToApi('/organizations/', { params })
  }

  getOrganization = async (id) => {
    return sendToApi(`/organizations/${id}/`)
  }

  getAction = async (id) => {
    return sendToApi(`/actions/${id}/`)
  }

  getDonorsMini = async (page_size = 10000) => {
    const params = { page_size }
    return sendToApi('/donors_mini/', { params })
  }

  // ORGANIZATION ACCOUNT PUBLIC ENDPOINTS
  sendSetPasswordEmail = async (email) => {
    return sendToApi('/account/send_set_password_email/', { method: 'POST', body: { email } })
  }

  setPasswordWithToken = async (token, password) => {
    return sendToApi('/account/set_password_with_token/', { method: 'POST', body: { token, password } })
  }

  token = async (email, password) => {
    return sendToApi('/account/token/', { method: 'POST', body: { email, password } })
  }

  // ORGANIZATION ACCOUNT PROTECTED ENDPOINTS
  deleteToken = async () => {
    return sendToApiAuth('org', '/account/delete_token/', { method: 'POST' })
  }

  setPassword = async (old_password, password) => {
    return sendToApiAuth('org', '/account/set_password/', { method: 'POST', body: { old_password, password } })
  }

  getMe = async () => {
    return sendToApiAuth('org', '/account/me/')
  }

  updateMe = async (body) => {
    return sendToApiAuth('org', '/account/me/', { method: 'PUT', body })
  }

  getAccountOrganization = async () => {
    return sendToApiAuth('org', '/account/organization/')
  }

  getAccountActions = async (archived = false, page_size = 250) => {
    const params = { archived, page_size }
    return sendToApiAuth('org', '/account/actions/', { params })
  }

  getAccountActionsMinimal = async (archived = false, page_size = 250) => {
    const params = { archived, page_size }
    return sendToApiAuth('org', '/account/actions/', { ...params, fields: 'id,action_type,desc,key' })
  }

  getAccountSubmissions = async (has_action = false, archived = false, page_size = 250) => {
    const params = { has_action, archived, page_size }
    return sendToApiAuth('org', '/account/submissions/', { params })
  }

  getAccountSubmission = async (id) => {
    return sendToApiAuth('org', `/account/submissions/${id}/`)
  }

  getAccountAction = async (key) => {
    return sendToApiAuth('org', `/account/actions_by_key/${key}/`)
  }

  createAccount = async (body) => {
    return sendToApiAuth('org', '/account/organizations/', { method: 'POST', body })
  }

  resetAccountKey = async () => {
    return sendToApiAuth('org', '/account/organization/reset_key/', { method: 'POST' })
  }

  updateAccountOrganization = async (body) => {
    return sendToApiAuth('org', '/account/organization/', { method: 'PUT', body })
  }

  createAccountAction = async (body) => {
    return sendToApiAuth('org', '/account/actions/', { method: 'POST', body })
  }

  updateAccountAction = async (id, body) => {
    return sendToApiAuth('org', `/account/actions/${id}/`, { method: 'PUT', body })
  }

  updateAccountSubmission = async (id, body) => {
    return sendToApiAuth('org', `/account/submissions/${id}/`, { method: 'PUT', body })
  }

  createAccountDonation = async (body) => {
    return sendToApiAuth('org', '/account/donations/', { method: 'POST', body })
  }

  updateAccountDonation = async (id, body) => {
    return sendToApiAuth('org', `/account/donations/${id}/`, { method: 'PUT', body })
  }

  deleteAccountDonation = async (id) => {
    return sendToApiAuth('org', `/account/donations/${id}/`, { method: 'DELETE' })
  }

  archiveAccountAction = async (id, archived) => {
    const body = { archived }
    return sendToApiAuth('org', `/account/actions/${id}/archive/`, { method: 'POST', body })
  }

  archiveAccountSubmission = async (id, archived) => {
    const body = { archived }
    return sendToApiAuth('org', `/account/submissions/${id}/archive/`, { method: 'POST', body })
  }

  updateAccountSubmissionImage = async (id, body) => {
    return sendToApiAuth('org', `/account/submissions/${id}/image/`, { method: 'PUT', body })
  }

  // DONOR ACCOUNT PUBLIC ENDPOINTS
  donorSendSetPasswordEmail = async (email) => {
    return sendToApi('/donor_account/send_set_password_email/', { method: 'POST', body: { email } })
  }

  donorSetPasswordWithToken = async (token, password) => {
    return sendToApi('/donor_account/set_password_with_token/', { method: 'POST', body: { token, password } })
  }

  donorToken = async (email, password) => {
    return sendToApi('/donor_account/token/', { method: 'POST', body: { email, password } })
  }

  // DONOR ACCOUNT PROTECTED ENDPOINTS
  donorDeleteToken = async () => {
    return sendToApiAuth('donor', '/donor_account/delete_token/', { method: 'POST' })
  }

  donorSetPassword = async (old_password, password) => {
    return sendToApiAuth('donor', '/donor_account/set_password/', { method: 'POST', body: { old_password, password } })
  }

  donorGetMe = async () => {
    return sendToApiAuth('donor', '/donor_account/me/')
  }

  donorUpdateMe = async (body) => {
    return sendToApiAuth('donor', '/donor_account/me/', { method: 'PUT', body })
  }

  donorGetDonor = async () => {
    return sendToApiAuth('donor', '/donor_account/donor/')
  }

  donorUpdateDonor = async (body) => {
    return sendToApiAuth('donor', '/donor_account/donor/', { method: 'PUT', body })
  }

  donorGetDonations = async (archived = false, page_size = 250) => {
    const params = { archived, page_size }
    return sendToApiAuth('donor', '/donor_account/donations/', { params })
  }

  donorCreateDonation = async (body) => {
    return sendToApiAuth('donor', '/donor_account/donations/', { method: 'POST', body })
  }

  donorGetDonation = async (id) => {
    return sendToApiAuth('donor', `/donor_account/donations/${id}/`)
  }

  donorUpdateDonation = async (id, body) => {
    return sendToApiAuth('donor', `/donor_account/donations/${id}/`, { method: 'PUT', body })
  }

  donorDeleteDonation = async (id) => {
    return sendToApiAuth('donor', `/donor_account/donations/${id}/`, { method: 'DELETE' })
  }
}

/**
 * Fetches data. Optionally passes results to `onResponse` then throws them into
 * Redux. Backs off exponentially if fetch throws exception.
 */
export const getBackoff = async (...args) => {
  let count = 0
  let delay = 1000
  const inner = async (getter, { onResponse, key }) => {
    let response = await getter()
    if (onResponse) {
      const modified = onResponse(response)
      if (modified) response = modified
    }
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
    let response = await getter()
    if (onResponse) {
      const modified = onResponse(response)
      if (modified) response = modified
    }
    const { data, error, exception, status } = response

    if (data) self.setState({ [stateKey]: { loading: false, data, error: undefined, status } })
    if (error) self.setState({ [stateKey]: { loading: false, error, status } })
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
