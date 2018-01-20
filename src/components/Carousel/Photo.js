import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Carousel.css'


const Photo = (props) => {
  const {
    actionId,
    description,
    address,
    location = {},
    organizationId,
    submitted,
    url,
    urlMedium,
    urlSmall,
  } = props

  return (
    <div style={{ backgroundImage: `url(${urlMedium})` }} className={Styles.photo}>
      <span>{description}</span>
      <span>{submitted}</span>
    </div>
  )
}

Photo.propTypes = {
  actionId: PropTypes.number.isRequired,
  description: PropTypes.string,
  address: PropTypes.string,
  location: PropTypes.object,
  organizationId: PropTypes.number.isRequired,
  submitted: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  urlMedium: PropTypes.string.isRequired,
  urlSmall: PropTypes.string.isRequired,
}

export default Photo
