import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Carousel.css'


const Photo = (props) => {
  const {
    lazyLoad,
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
    <div style={lazyLoad ? null : { background: `url(${urlMedium}) no-repeat center` }} className={Styles.photo}>
      <span className={Styles.description}>{description}</span>
      <span className={Styles.timestamp}>{submitted}</span>
    </div>
  )
}

Photo.propTypes = {
  lazyLoad: PropTypes.bool,
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
