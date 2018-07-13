const defaultState = {
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'SEARCH': {
    return {
      ...state,
      [payload.key]: payload.value,
    }
  }
  default:
    return state
  }
}
