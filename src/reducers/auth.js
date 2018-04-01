const defaultState = {
  org: {},
  donor: {},
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'AUTH_SET': {
    const { auth, type: t } = payload
    return { ...state, [t]: auth }
  }
  case 'AUTH_UNSET': {
    const { type: t } = payload
    return { ...state, [t]: {} }
  }
  default:
    return state
  }
}
