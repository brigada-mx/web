import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import YouTubeVideo from 'components/YouTubeVideo'
import LatLngLink from 'components/LatLngLink'
import Styles from './TestimonialVideo.css'


const TestimonialVideo = ({ testimonial }) => {
  const { video: { youtube_video_id: videoId }, recipients, location: { lat, lng }, submitted } = testimonial
  const latLng = lat !== undefined && <LatLngLink lat={lat} lng={lng} className={Styles.mapLink} />

  return (
    <div>
      <YouTubeVideo videoId={videoId} />
      <div className={Styles.labelContainer}>
        <span className={Styles.label}>{moment(submitted).format('h:mma, DD MMMM YYYY')}</span>
        <span className={Styles.label}>{latLng}</span>
      </div>
      <span className={Styles.description}>Para {recipients}</span>
    </div>
  )
}

TestimonialVideo.propTypes = {
  testimonial: PropTypes.object.isRequired,
}

export default TestimonialVideo
