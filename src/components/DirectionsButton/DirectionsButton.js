import React from 'react'
import PropTypes from 'prop-types'

import Styles from './DirectionsButton.css'


/**
 * https://developers.google.com/maps/documentation/urls/guide
 * https://gearside.com/easily-link-to-locations-and-directions-using-the-new-google-maps/
 */
const DirectionsButton = ({ lat, lng, classNameCustom = '' }) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  return <a target="_blank" className={`${Styles.button} ${classNameCustom}`} href={url} />
}

DirectionsButton.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  classNameCustom: PropTypes.string,
}

export default DirectionsButton
