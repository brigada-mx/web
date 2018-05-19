import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

const imgWithClick = { cursor: 'pointer' }


class Photo extends PureComponent {
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
    const imgStyle = { display: 'block', float: 'left', margin }
    return (
      <img
        style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
        {...photo}
        onClick={onClick ? this.handleClick : undefined}
        onMouseEnter={onMouseEnter ? this.handleMouseEnter : undefined}
      />
    )
  }
}

export const photoPropType = PropTypes.shape({
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onMouseEnter: PropTypes.func,
  alt: PropTypes.string,
  title: PropTypes.string,
  srcSet: PropTypes.array,
  sizes: PropTypes.array,
})

Photo.propTypes = {
  index: PropTypes.number,
  onClick: PropTypes.func,
  photo: photoPropType,
  margin: PropTypes.number.isRequired,
}

export default Photo
