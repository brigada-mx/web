import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import { toDegrees } from 'tools/other'
import { thumborUrl, googleMapsUrl } from 'tools/string'
import Styles from './Carousel.css'


moment.locale('es')

const Photo = ({ lazyLoad, description, location, submitted, image }) => {
  const { lat, lng } = location || {}
  let latLng = null
  if (lat) {
    const [latsign, latd, latm, lats] = toDegrees(lat)
    const [lngsign, lngd, lngm, lngs] = toDegrees(lng)
    const latStr = `${latd}°${latm}'${lats}"${latsign >= 0 ? 'N' : 'S'}`
    const lngStr = `${lngd}°${lngm}'${lngs}"${lngsign >= 0 ? 'E' : 'W'}`
    latLng = (
      <a className={Styles.mapLink} target="_blank" rel="noopener noreferrer" href={googleMapsUrl(lat, lng)}>
        {`${latStr} ${lngStr}`}
      </a>
    )
  }

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
