import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Preview.css'


const Preview = ({ type, src, onClick }) => {
  let image = <div onClick={onClick} className={Styles.emptyThumbnail} />
  if (type === 'image' && src) {
    const backgroundImage = `url("${src}")`
    image = <div onClick={onClick} className={Styles.image} style={{ backgroundImage }} />
  }
  if (type === 'video' && src) {
    const backgroundImage = `url("${src}")`
    image = <div onClick={onClick} className={Styles.video} style={{ backgroundImage }} />
  }
  return image
}

Preview.propTypes = {
  type: PropTypes.string,
  src: PropTypes.string,
  onClick: PropTypes.func,
}

export default Preview
