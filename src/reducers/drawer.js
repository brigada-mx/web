const defaultState = {
  visible: false,
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'DRAWER_TOGGLE':
    return {
      ...state,
      visible: payload.visible,
    }
  default:
    return state
  }
}
