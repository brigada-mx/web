import React from 'react'
import PropTypes from 'prop-types'

import YouTubeVideo from 'components/YouTubeVideo'


const ModalQsTestimonial = ({ modalPropsString }) => {
  return <YouTubeVideo videoId={modalPropsString || '_'} />
}

ModalQsTestimonial.propTypes = {
  modalPropsString: PropTypes.string,
}

export default ModalQsTestimonial
