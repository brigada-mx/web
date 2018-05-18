import React from 'react'
import PropTypes from 'prop-types'

import Gallery from 'react-photo-gallery'
import moment from 'moment'

import { thumborUrl } from 'tools/string'
import Styles from './PhotoGallery.css'


class PhotoGallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { submissions } = this.props
    const photos = [].concat(...submissions.map((s) => {
      const { images, submitted } = s
      return images.filter(
        i => i.width !== undefined && i.height !== undefined
      ).map(
        (i) => { return { ...i, src: thumborUrl(i, 480, 480), submitted, alt: 'No encontrado' } }
      ).sort((a, b) => {
        if (a.submitted < b.submitted) return -1
        if (a.submitted > b.submitted) return 1
        return 0
      })
    }))

    const groupByMonth = photos.reduce((obj, photo) => {
      const date = moment(photo.submitted)
      const yearMonth = date.format('YYYY-MM-01')
      if (yearMonth in obj) obj[yearMonth].push(photo)
      else obj[yearMonth] = [photo] // eslint-disable-line no-param-reassign
      return obj
    }, {})

    return (
      <div>
        {Object.keys(groupByMonth).sort((a, b) => {
          if (a.submitted < b.submitted) return -1
          if (a.submitted > b.submitted) return 1
          return 0
        }).map((month) => {
          const group = groupByMonth[month]
          return (
            <div key={month}>
              <div className={Styles.groupLabel}>{moment(month).format('MMMM \'YY')}</div>
              <Gallery photos={group} />
            </div>
          )
        })}
      </div>
    )
  }
}

PhotoGallery.propTypes = {
  submissions: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default PhotoGallery
