import React from 'react'
import PropTypes from 'prop-types'

import Gallery from 'react-photo-gallery'
import moment from 'moment'

import { thumborUrl } from 'tools/string'
import Photo from './Photo'
import Styles from './PhotoGallery.css'


class PhotoGallery extends React.PureComponent {
  render() {
    const { submissions, selectedUrl, testimonials, onClickItem, onMouseEnterItem, columns } = this.props
    const _images = [].concat(...submissions.map((s) => {
      const { id, images, submitted, location, description } = s
      return images.filter(
        i => i.width !== undefined && i.height !== undefined
      ).map((i) => {
        return {
          ...i,
          onMouseEnter: onMouseEnterItem,
          src: thumborUrl(i, 480, 480),
          alt: description,
          title: description,
          submitted,
          location,
          type: 'image',
          id,
        }
      })
    }))
    const videos = testimonials.map((t) => {
      const { id, video, submitted, location, description } = t
      return {
        ...video,
        width: 480,
        height: 360,
        onMouseEnter: onMouseEnterItem,
        src: video.url_thumbnail,
        alt: description,
        title: description,
        submitted,
        location,
        type: 'video',
        id,
      }
    })
    const photos = _images.concat(videos).sort((a, b) => {
      if (a.submitted < b.submitted) return 1
      if (a.submitted > b.submitted) return -1
      if (a.src < b.src) return 1
      if (a.src > b.src) return -1
      return 0
    })
    if (selectedUrl) {
      const photo = photos.find(p => p.url === selectedUrl)
      if (photo) photo.selected = true
    }

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
              <div className={Styles.groupLabel}>{moment(month).format('MMMM YYYY')}</div>
              <Gallery
                columns={window.innerWidth >= 768 ? columns : 2}
                margin={4}
                photos={group}
                onClick={onClickItem}
                ImageComponent={Photo}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

PhotoGallery.propTypes = {
  submissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  testimonials: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedUrl: PropTypes.string,
  onClickItem: PropTypes.func,
  columns: PropTypes.number,
  onMouseEnterItem: PropTypes.func,
}

export default PhotoGallery
