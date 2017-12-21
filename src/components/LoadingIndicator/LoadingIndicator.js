import React from 'react'

import Styles from './LoadingIndicator.css'


const LoadingIndicator = () => {
  return (
    <div className={Styles.spinner}>
      <div className={Styles.rect1} />
      <div className={Styles.rect2} />
      <div className={Styles.rect3} />
      <div className={Styles.rect4} />
      <div className={Styles.rect5} />
    </div>
  )
}

export default LoadingIndicator
