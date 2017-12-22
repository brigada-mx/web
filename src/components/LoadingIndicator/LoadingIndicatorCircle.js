import React from 'react'
import PropTypes from 'prop-types'

import Styles from './LoadingIndicatorCircle.css'


const LoadingIndicatorCircle = ({ classNameCustom = '' }) => {
  return (
    <div className={`${Styles.spinner} ${classNameCustom}`}>
      <div className={Styles.doubleBounce1} />
      <div className={Styles.doubleBounce2} />
    </div>
  )
}

LoadingIndicatorCircle.propTypes = {
  classNameCustom: PropTypes.string,
}

export default LoadingIndicatorCircle
