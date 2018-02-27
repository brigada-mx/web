const defaultState = {
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'GETTER': {
    const { response, key } = payload
    return {
      ...state,
      [key]: response,
    }
  }
  default:
    return state
  }
}
