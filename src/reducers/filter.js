const defaultState = {
  organizations: {},
  localities: {},
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'FILTER_ORGANIZATIONS': {
    const { prop, values } = payload
    return {
      ...state,
      organizations: {
        ...state.organizations,
        [prop]: values,
      },
    }
  }
  case 'FILTER_LOCALITIES': {
    const { prop, values } = payload
    return {
      ...state,
      localities: {
        ...state.localities,
        [prop]: values,
      },
    }
  }
  default:
    return state
  }
}
