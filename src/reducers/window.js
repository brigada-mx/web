const defaultState = {
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'WINDOW_PROPERTIES': {
    return {
      ...state,
      ...payload.properties,
    }
  }
  default:
    return state
  }
}
