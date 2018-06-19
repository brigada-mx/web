import React from 'react'
import PropTypes from 'prop-types'

import YouTubeVideo from 'components/YouTubeVideo'


const ModalQsWrapper = ({ modalPropsString }) => {
  return <YouTubeVideo videoId={modalPropsString || '_'} />
}

ModalQsWrapper.propTypes = {
  modalPropsString: PropTypes.string,
}

export default ModalQsWrapper
