const defaultState = {
}

export default function reduce(state = defaultState, { type, payload }) {
  switch (type) {
  case 'YOUTUBE_TIMESTAMP': {
    const { videoId, timestamp } = payload
    return {
      ...state,
      [videoId]: { timestamp },
    }
  }
  default:
    return state
  }
}
