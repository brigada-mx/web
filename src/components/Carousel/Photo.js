import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import LatLngLink from 'components/LatLngLink'
import { thumborUrl } from 'tools/string'
import Styles from './Carousel.css'


moment.locale('es')

const Photo = ({ lazyLoad, description, location, submitted, image }) => {
  const { lat, lng } = location || {}
  const latLng = lat !== undefined && <LatLngLink lat={lat} lng={lng} className={Styles.mapLink} />

  return (
    <div className={Styles.outerBox}>
      <div className={Styles.innerBox}>
        {lazyLoad ? <div /> : <img
          src={thumborUrl(image, 1280, 1280)}
          alt={description}
        />}
        <div>
          <div className={Styles.labelContainer}>
            <span className={Styles.label}>{moment(submitted).format('h:mma, DD MMMM YYYY')}</span>
            <span className={Styles.label}>{latLng}</span>
          </div>
        </div>
        <span className={Styles.description}>{description}</span>
      </div>
    </div>
  )
}

Photo.propTypes = {
  lazyLoad: PropTypes.bool,
  description: PropTypes.string,
  location: PropTypes.object,
  submitted: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
}

export default Photo
