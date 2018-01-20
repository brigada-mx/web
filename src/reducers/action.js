const defaultState = {
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'ACTION_DATA': {
    const { id, data } = payload
    return {
      ...state,
      [id]: data,
    }
  }
  default:
    return state
  }
}
