import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Preview.css'


const Preview = ({ type, src, onClick, width, height, emptySrc, emptyStyle = {} }) => {
  let className = {
    image: Styles.image,
    video: Styles.video,
  }[type] || Styles.emptyThumbnail
  if (onClick) className = `${className} ${Styles.clickable}`

  const _style = {}
  if (width !== undefined) _style.width = width
  if (height !== undefined) _style.height = height
  if (src) _style.backgroundImage = `url("${src}")`

  let merged = _style
  if (!type) {
    merged = { ..._style, ...emptyStyle }
    if (emptySrc) merged.backgroundImage = `url("${emptySrc}")`
  }

  return <div onClick={onClick} className={className} style={merged} />
}

Preview.propTypes = {
  type: PropTypes.string,
  src: PropTypes.string,
  onClick: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  emptySrc: PropTypes.string,
  emptyStyle: PropTypes.object,
}

export default Preview
