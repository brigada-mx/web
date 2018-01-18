import React from 'react'
import PropTypes from 'prop-types'

import Styles from './LoadingIndicatorCircle.css'


const LoadingIndicatorCircle = ({ className = '' }) => {
  return (
    <div className={`${Styles.spinner} ${className}`}>
      <div className={Styles.doubleBounce1} />
      <div className={Styles.doubleBounce2} />
    </div>
  )
}

LoadingIndicatorCircle.propTypes = {
  className: PropTypes.string,
}

export default LoadingIndicatorCircle
