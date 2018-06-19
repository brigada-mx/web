import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import service, { getBackoff } from 'api/service'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import YouTubeVideo from 'components/YouTubeVideo'


class TestimonialYouTubeVideo extends React.Component {
  componentDidMount() {
    const { testimonialId } = this.props
    getBackoff(() => service.getTestimonial(testimonialId), { key: `testimonials_${testimonialId}` })
  }

  render() {
    const { videoId } = this.props
    if (!videoId) return <LoadingIndicatorCircle />
    return <YouTubeVideo videoId={videoId} />
  }
}

TestimonialYouTubeVideo.propTypes = {
  testimonialId: PropTypes.number.isRequired,
  videoId: PropTypes.string,
}

const mapStateToProps = (state, { testimonialId }) => {
  try {
    return { videoId: state.getter[`testimonials_${testimonialId}`].data.video.youtube_video_id }
  } catch (e) {
    return {}
  }
}

const ReduxTestimonialYouTubeVideo = connect(mapStateToProps, null)(TestimonialYouTubeVideo)


const ModalWrapper = ({ modalPropsString }) => {
  const testimonialId = Number.parseInt(modalPropsString, 10)
  return !Number.isNaN(testimonialId) && <ReduxTestimonialYouTubeVideo testimonialId={testimonialId} />
}

ModalWrapper.propTypes = {
  modalPropsString: PropTypes.string.isRequired,
}

export default ModalWrapper
export { ReduxTestimonialYouTubeVideo }
