let id = 0
const defaultState = {
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'SNACKBAR': {
    id += 1
    const { message, status } = payload
    return {
      id,
      message,
      status,
    }
  }
  default:
    return state
  }
}
