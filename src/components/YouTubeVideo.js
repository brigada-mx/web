import React from 'react'
import PropTypes from 'prop-types'

import YouTube from 'react-youtube'


const opts = {
  height: '390',
  width: '640',
  playerVars: { // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
  },
}

class YouTubeVideo extends React.Component {
  handleReady = (event) => {
    if (this.props.onReady) this.props.onReady(event)
  }

  render() {
    const { videoId } = this.props
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
  onReady: PropTypes.func,
}

export default YouTubeVideo
