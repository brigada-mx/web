import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Preview.css'


const Preview = ({ type, src, onClick, width, height }) => {
  let className = {
    image: Styles.image,
    video: Styles.video,
  }[type] || Styles.emptyThumbnail
  if (onClick) className = `${className} ${Styles.clickable}`

  const style = {}
  if (width !== undefined) style.width = width
  if (height !== undefined) style.height = height
  if (src) style.backgroundImage = `url("${src}")`

  return <div onClick={onClick} className={className} style={style} />
}

Preview.propTypes = {
  type: PropTypes.string,
  src: PropTypes.string,
  onClick: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default Preview
