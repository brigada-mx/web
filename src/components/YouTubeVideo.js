import React from 'react'
import PropTypes from 'prop-types'

import YouTube from 'react-youtube'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'


class YouTubeVideo extends React.Component {
  state = {}

  componentWillUnmount() {
    const { player } = this.state
    if (player) {
      const currentTime = player.getCurrentTime()
      const duration = player.getDuration()
      if (duration - currentTime < 5) this.props.onUnmount(this.props.videoId, 0)
      else this.props.onUnmount(this.props.videoId, currentTime)
    }
  }

  handleReady = (event) => {
    if (this.props.onReady) this.props.onReady(event)
    this.setState({ player: event.target })
  }

  render() {
    const { videoId, timestamp = 0 } = this.props

    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        start: Math.floor(timestamp),
        rel: 0, // don't show related videos when playback finishes
      },
    }

    return (
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={this.handleReady}
      />
    )
  }
}

YouTubeVideo.propTypes = {
  videoId: PropTypes.string.isRequired,
  onUnmount: PropTypes.func.isRequired,
  onReady: PropTypes.func,
  timestamp: PropTypes.number,
}

const mapStateToProps = (state, { videoId }) => {
  const video = state.youtube[videoId]
  if (!video) return {}
  return { timestamp: video.timestamp }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUnmount: (videoId, timestamp) => Actions.youtubeTimestamp(dispatch, { videoId, timestamp }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(YouTubeVideo)
