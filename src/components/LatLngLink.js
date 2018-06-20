import React from 'react'
import PropTypes from 'prop-types'

import { toDegrees } from 'tools/other'
import { googleMapsUrl } from 'tools/string'


const LatLngLink = ({ lat, lng, className = '' }) => {
  const [latsign, latd, latm, lats] = toDegrees(lat)
  const [lngsign, lngd, lngm, lngs] = toDegrees(lng)
  const latStr = `${latd}°${latm}'${lats}"${latsign >= 0 ? 'N' : 'S'}`
  const lngStr = `${lngd}°${lngm}'${lngs}"${lngsign >= 0 ? 'E' : 'W'}`
  return (
    <a className={className} target="_blank" rel="noopener noreferrer" href={googleMapsUrl(lat, lng)}>
      {`${latStr} ${lngStr}`}
    </a>
  )
}

LatLngLink.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  className: PropTypes.string,
}

export default LatLngLink
