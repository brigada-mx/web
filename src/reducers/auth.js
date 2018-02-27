const defaultState = {
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'AUTH_SET': {
    const { auth } = payload
    return auth
  }
  case 'AUTH_UNSET': {
    return {}
  }
  default:
    return state
  }
}
