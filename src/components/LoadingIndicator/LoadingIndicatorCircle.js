import React from 'react'

import Styles from './LoadingIndicatorCircle.css'


const LoadingIndicatorCircle = () => {
  return (
    <div className={Styles.spinner}>
      <div className={Styles.doubleBounce1} />
      <div className={Styles.doubleBounce2} />
    </div>
  )
}

export default LoadingIndicatorCircle
