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
  supportTicketCreate = async (body) => {
    return sendToApi('/support_ticket_create/', { method: 'POST', body })
  }

  getLocalityActions = async (locality_id, page_size = 250) => {
    const params = { locality_id, page_size }
    return sendToApi('/actions/', { params })
  }

  getDonorDonations = async (donor_id, page_size = 250) => {
    const params = { donor_id, page_size }
    return sendToApi('/donations/', { params })
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

  getLocalitiesWithActions = async (page_size = 10000) => {
    const params = { page_size }
    return sendToApi('/localities_with_actions/', { params })
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

  getDonors = async (page_size = 1000) => {
    const params = { page_size }
    return sendToApi('/donors/', { params })
  }

  getDonor = async (id) => {
    return sendToApi(`/donors/${id}/`)
  }

  getAction = async (id) => {
    return sendToApi(`/actions/${id}/`)
  }

  getDonorsMini = async (page_size = 10000) => {
    const params = { page_size }
    return sendToApi('/donors_mini/', { params })
  }

  getActionsMini = async (page_size = 10000) => {
    const params = { page_size }
    return sendToApi('/actions_mini/', { params })
  }

  getOpportunity = async (id) => {
    return sendToApi(`/volunteer_opportunities/${id}/`)
  }

  getOpportunities = async (page_size = 250) => {
    const params = { page_size, transparency_level__gte: 2, ordering: '-action__score' }
    return sendToApi('/volunteer_opportunities/', { params })
  }

  getActionShare = async (actionId, email = '') => {
    const params = { email }
    return sendToApi(`/action_share/${actionId}/`, { params })
  }

  getTestimonial = async (id) => {
    return sendToApi(`/testimonials/${id}/`)
  }

  // VOLUNTEER PUBLIC ENDPOINTS
  createVolunteerApplication = async (body) => {
    return sendToApi('/volunteer_applications/', { method: 'POST', body })
  }

  createBrigadaUser = async (body) => {
    return sendToApi('/brigada_users/', { method: 'POST', body })
  }

  createShare = async (body) => {
    return sendToApi('/shares/', { method: 'POST', body })
  }

  shareSetUser = async (email, share_id) => {
    const body = { email, share_id }
    return sendToApi('/share_set_user/', { method: 'POST', body })
  }

  // DISCOURSE
  discourseLogin = async (email, password, sso, sig) => {
    return sendToApi('/discourse/login/', {
      method: 'POST', body: { email, password, sso, sig },
    })
  }

  accountDiscourseLogin = async (sso, sig) => {
    return sendToApiAuth('org', '/discourse/authenticated_login/', { method: 'POST', body: { sso, sig } })
  }

  donorDiscourseLogin = async (sso, sig) => {
    return sendToApiAuth('donor', '/discourse/authenticated_login/', { method: 'POST', body: { sso, sig } })
  }

  // ORGANIZATION ACCOUNT PUBLIC ENDPOINTS
  createAccount = async (body) => {
    return sendToApi('/account/organizations/', { method: 'POST', body })
  }

  sendSetPasswordEmail = async (email) => {
    return sendToApi('/account/send_set_password_email/', { method: 'POST', body: { email } })
  }

  setPasswordWithToken = async (token, password, created) => {
    return sendToApi('/account/set_password_with_token/', { method: 'POST', body: { token, password, created } })
  }

  token = async (email, password) => {
    return sendToApi('/account/token/', { method: 'POST', body: { email, password } })
  }

  // ORGANIZATION ACCOUNT PROTECTED ENDPOINTS
  accountCreateUser = async (body) => {
    return sendToApiAuth('org', '/account/users/', { method: 'POST', body })
  }

  accountUpdateUser = async (id, body) => {
    return sendToApiAuth('org', `/account/users/${id}/`, { method: 'PUT', body })
  }

  accountGetUsers = async () => {
    return sendToApiAuth('org', '/account/users/', { method: 'GET' })
  }

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

  accountGetProfileStrength = async () => {
    return sendToApiAuth('org', '/account/profile_strength/')
  }

  accountGetActionStrength = async (id) => {
    return sendToApiAuth('org', `/account/action_strength/${id}/`)
  }

  accountGetOrganization = async () => {
    return sendToApiAuth('org', '/account/organization/')
  }

  accountGetActions = async (archived = false, page_size = 250) => {
    const params = { archived, page_size }
    return sendToApiAuth('org', '/account/actions/', { params })
  }

  accountGetActionsMinimal = async (archived = false, page_size = 250) => {
    const params = { archived, page_size }
    return sendToApiAuth('org', '/account/actions/', { ...params, fields: 'id,action_type,desc,key' })
  }

  accountGetSubmissions = async (has_action = false, archived = false, page_size = 250) => {
    const params = { has_action, archived, page_size }
    return sendToApiAuth('org', '/account/submissions/', { params })
  }

  accountGetSubmission = async (id) => {
    return sendToApiAuth('org', `/account/submissions/${id}/`)
  }

  accountGetTestimonials = async (archived = false, page_size = 250) => {
    const params = { archived, page_size }
    return sendToApiAuth('org', '/account/testimonials/', { params })
  }

  accountGetTestimonial = async (id) => {
    return sendToApiAuth('org', `/account/testimonials/${id}/`)
  }

  accountGetAction = async (key) => {
    return sendToApiAuth('org', `/account/actions_by_key/${key}/`)
  }

  accountResetKey = async () => {
    return sendToApiAuth('org', '/account/organization/reset_key/', { method: 'POST' })
  }

  accountUpdateOrganization = async (body) => {
    return sendToApiAuth('org', '/account/organization/', { method: 'PUT', body })
  }

  accountCreateAction = async (body) => {
    return sendToApiAuth('org', '/account/actions/', { method: 'POST', body })
  }

  accountUpdateAction = async (id, body) => {
    return sendToApiAuth('org', `/account/actions/${id}/`, { method: 'PUT', body })
  }

  accountCreateSubmission = async (actionId, body) => {
    return sendToApiAuth('org', '/account/submissions/', { method: 'POST', body: { ...body, action: actionId } })
  }

  accountUpdateSubmission = async (id, body) => {
    return sendToApiAuth('org', `/account/submissions/${id}/`, { method: 'PUT', body })
  }

  accountCreateTestimonial = async (actionId, body) => {
    return sendToApiAuth('org', '/account/testimonials/', { method: 'POST', body: { ...body, action: actionId } })
  }

  accountUpdateTestimonial = async (id, body) => {
    return sendToApiAuth('org', `/account/testimonials/${id}/`, { method: 'PUT', body })
  }

  accountCreateDonation = async (body) => {
    return sendToApiAuth('org', '/account/donations/', { method: 'POST', body })
  }

  accountUpdateDonation = async (id, body) => {
    return sendToApiAuth('org', `/account/donations/${id}/`, { method: 'PUT', body })
  }

  accountDeleteDonation = async (id) => {
    return sendToApiAuth('org', `/account/donations/${id}/`, { method: 'DELETE' })
  }

  accountGetOpportunity = async (id) => {
    return sendToApiAuth('org', `/account/volunteer_opportunities/${id}`)
  }

  accountGetOpportunities = async (action_id, page_size = 500) => {
    const params = { action_id, page_size }
    return sendToApiAuth('org', '/account/volunteer_opportunities/', { params })
  }

  accountCreateOpportunity = async (body) => {
    return sendToApiAuth('org', '/account/volunteer_opportunities/', { method: 'POST', body })
  }

  accountUpdateOpportunity = async (id, body) => {
    return sendToApiAuth('org', `/account/volunteer_opportunities/${id}/`, { method: 'PUT', body })
  }

  accountArchiveAction = async (id, archived) => {
    const body = { archived }
    return sendToApiAuth('org', `/account/actions/${id}/archive/`, { method: 'POST', body })
  }

  accountArchiveSubmission = async (id, archived) => {
    const body = { archived }
    return sendToApiAuth('org', `/account/submissions/${id}/archive/`, { method: 'POST', body })
  }

  accountUpdateSubmissionImage = async (id, body) => {
    return sendToApiAuth('org', `/account/submissions/${id}/image/`, { method: 'PUT', body })
  }

  getUploadUrl = async (filename) => {
    const body = { filename }
    return sendToApiAuth('org', '/files/upload_url/', { method: 'POST', body })
  }

  // DONOR ACCOUNT PUBLIC ENDPOINTS
  donorCreateAccount = async (body) => {
    return sendToApi('/donor_account/donors/', { method: 'POST', body })
  }

  donorSendSetPasswordEmail = async (email) => {
    return sendToApi('/donor_account/send_set_password_email/', { method: 'POST', body: { email } })
  }

  donorSetPasswordWithToken = async (token, password, created) => {
    return sendToApi('/donor_account/set_password_with_token/', { method: 'POST', body: { token, password, created } })
  }

  donorToken = async (email, password) => {
    return sendToApi('/donor_account/token/', { method: 'POST', body: { email, password } })
  }

  // DONOR ACCOUNT PROTECTED ENDPOINTS
  donorCreateUser = async (body) => {
    return sendToApiAuth('donor', '/donor_account/users/', { method: 'POST', body })
  }

  donorUpdateUser = async (id, body) => {
    return sendToApiAuth('donor', `/donor_account/users/${id}/`, { method: 'PUT', body })
  }

  donorGetUsers = async () => {
    return sendToApiAuth('donor', '/donor_account/users/', { method: 'GET' })
  }

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

  donorGetProfileStrength = async () => {
    return sendToApiAuth('donor', '/donor_account/profile_strength/')
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
  const inner = async (self, getter, { stateKey, key, onResponse }) => {
    let response = await getter()
    if (onResponse) {
      const modified = onResponse(response)
      if (modified) response = modified
    }
    if (key) Actions.getter(store.dispatch, { response, key })
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
