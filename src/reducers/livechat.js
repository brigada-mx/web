const defaultState = {
  open: false,
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'LIVECHAT': {
    const { open } = payload
    return {
      ...state,
      open,
    }
  }
  default:
    return state
  }
}
