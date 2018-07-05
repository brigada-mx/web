/* @flow */
import React from 'react'

import moment from 'moment'

import LatLngLink from 'components/LatLngLink'
import { thumborUrl } from 'tools/string'
import Styles from './Carousel.css'


moment.locale('es')

type Props = { lazyLoad?: boolean, description?: string, location?: Object, submitted: string, image: Object };

const Photo = ({ lazyLoad, description, location, submitted, image }: Props) => {
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

export default Photo
