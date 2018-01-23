import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import Styles from './Carousel.css'


moment.locale('es')

const toDegrees = (coordinate) => {
  const absolute = Math.abs(coordinate)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60)

  return [degrees, minutes, seconds]
}


const Photo = (props) => {
  const {
    lazyLoad,
    description,
    address,
    location,
    organizationId,
    submitted,
    url,
    urlMedium,
    urlSmall,
  } = props

  const { lat, lng } = location || {}
  let latLng = null
  if (lat) {
    const [latd, latm, lats] = toDegrees(lat)
    const [lngd, lngm, lngs] = toDegrees(lng)
    latLng = <span>{`${latd}°${latm}'${lats}"N ${lngd}°${lngm}'${lngs}"W`}</span>
  }

  return (
    <div className={Styles.photo}>
      {lazyLoad ? <div /> : <img src={urlMedium} alt={description} />}
      <div className={Styles.labelContainer}>
        <span>{moment(submitted).format('h:mma, DD MMMM YYYY')}</span>
        {latLng}
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
