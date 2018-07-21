import { localStorage } from 'tools/storage'


export async function drawerToggle(dispatch, { visible }) {
  dispatch({
    type: 'DRAWER_TOGGLE',
    payload: { visible },
  })
}

export async function searchSet(dispatch, { key = 'search', value }) {
  dispatch({
    type: 'SEARCH',
    payload: { key, value },
  })
}

export async function actionData(dispatch, { id, data }) {
  dispatch({
    type: 'ACTION_DATA',
    payload: { id, data },
  })
}

export async function authSet(dispatch, { auth, type = 'org' }) {
  localStorage.setItem(`719s:auth-${type}`, JSON.stringify(auth))

  dispatch({
    type: 'AUTH_SET',
    payload: { auth, type },
  })
}

export async function authMerge(dispatch, { auth, type = 'org' }) {
  const key = `719s:auth-${type}`
  const item = localStorage.getItem(key)
  if (item) {
    const _obj = JSON.parse(item)
    localStorage.setItem(key, JSON.stringify({ ..._obj, ...auth }))
  } else {
    localStorage.setItem(key, JSON.stringify(auth))
  }

  dispatch({
    type: 'AUTH_MERGE',
    payload: { auth, type },
  })
}

export async function authUnset(dispatch, { type = 'org' }) {
  localStorage.removeItem(`719s:auth-${type}`)

  dispatch({
    type: 'AUTH_UNSET',
    payload: { type },
  })
}

export async function getter(dispatch, { response, key }) {
  dispatch({
    type: 'GETTER',
    payload: { response, key },
  })
}

export async function snackbar(dispatch, { message, status, duration }) {
  dispatch({
    type: 'SNACKBAR',
    payload: { message, status, duration },
  })
}

export async function livechat(dispatch, { open }) {
  dispatch({
    type: 'LIVECHAT',
    payload: { open },
  })
}

export async function modal(dispatch, modalName, props = {}) {
  dispatch({
    type: 'MODAL',
    payload: { modalName, ...props },
  })
}

export async function youtubeTimestamp(dispatch, { videoId, timestamp }) {
  dispatch({
    type: 'YOUTUBE_TIMESTAMP',
    payload: { videoId, timestamp },
  })
}

export async function windowProperties(dispatch, { properties }) {
  dispatch({
    type: 'WINDOW_PROPERTIES',
    payload: { properties },
  })
}
