/* @flow */
import React from 'react'

import { toDegrees } from 'tools/other'
import { googleMapsUrl } from 'tools/string'


const LatLngLink = ({ lat, lng, className = '' }: { lat: number, lng: number, className?: string }) => {
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

export default LatLngLink
