const defaultState = {
  org: {},
  donor: {},
  brigada: {},
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'AUTH_SET': {
    const { auth, type: t } = payload
    return { ...state, [t]: auth }
  }
  case 'AUTH_MERGE': {
    const { auth, type: t } = payload
    const _auth = { ...state[t], ...auth }
    return { ...state, [t]: _auth }
  }
  case 'AUTH_UNSET': {
    const { type: t } = payload
    return { ...state, [t]: {} }
  }
  default:
    return state
  }
}
