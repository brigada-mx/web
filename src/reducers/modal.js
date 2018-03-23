const defaultState = {
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'MODAL': {
    return payload
  }
  default:
    return state
  }
}
