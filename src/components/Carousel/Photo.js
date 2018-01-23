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
    <div className={Styles.photo}>
      <img src={urlMedium} alt={description} />
      <div className={Styles.labelContainer}>
        <span>{submitted}</span>
        <span>{submitted}</span>
      </div>
      <span className={Styles.description}>{description}</span>
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
