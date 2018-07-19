import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Preview.css'


const Preview = ({ type, src, onClick, width, height, style = {} }) => {
  let className = {
    image: Styles.image,
    video: Styles.video,
  }[type] || Styles.emptyThumbnail
  if (onClick) className = `${className} ${Styles.clickable}`

  const _style = {}
  if (width !== undefined) _style.width = width
  if (height !== undefined) _style.height = height
  if (src) _style.backgroundImage = `url("${src}")`

  return <div onClick={onClick} className={className} style={{ ..._style, ...style }} />
}

Preview.propTypes = {
  type: PropTypes.string,
  src: PropTypes.string,
  onClick: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
}

export default Preview
