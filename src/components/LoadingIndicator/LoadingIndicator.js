import React from 'react'
import PropTypes from 'prop-types'

import Styles from './LoadingIndicator.css'


const LoadingIndicator = ({ classNameCustom = '' }) => {
  return (
    <div className={`${Styles.spinner} ${classNameCustom}`}>
      <div className={Styles.rect1} />
      <div className={Styles.rect2} />
      <div className={Styles.rect3} />
      <div className={Styles.rect4} />
      <div className={Styles.rect5} />
    </div>
  )
}

LoadingIndicator.propTypes = {
  classNameCustom: PropTypes.string,
}

export default LoadingIndicator
