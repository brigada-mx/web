import React from 'react'
import PropTypes from 'prop-types'

import isEqual from 'lodash/isEqual'

import Styles from './PhotoGallery.css'


class Photo extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps)
  }

  handleClick = (event) => {
    const { onClick, index, photo } = this.props
    onClick(event, { photo, index })
  }

  handleMouseEnter = (event) => {
    const { index, photo, photo: { onMouseEnter } } = this.props
    onMouseEnter(event, { photo, index })
  }

  render() {
    const { photo, photo: { onMouseEnter }, onClick, margin } = this.props
    const { src, width, height, alt, title, type, selected = false } = photo

    let className = type === 'video' ? Styles.video : Styles.image
    if (selected) className = `${className} ${Styles.selected}`

    return (
      <div
        className={className}
        style={{ width, height, margin }}
        onClick={onClick ? this.handleClick : undefined}
        onMouseEnter={onMouseEnter ? this.handleMouseEnter : undefined}
      >
        <img
          src={src}
          width={width}
          height={height}
          alt={alt}
          title={title}
        />
      </div>
    )
  }
}

export const photoPropType = PropTypes.shape({
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  alt: PropTypes.string,
  title: PropTypes.string,
})

Photo.propTypes = {
  index: PropTypes.number,
  onClick: PropTypes.func,
  photo: photoPropType,
  margin: PropTypes.number.isRequired,
}

export default Photo
