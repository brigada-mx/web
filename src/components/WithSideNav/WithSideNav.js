import React from 'react'
import PropTypes from 'prop-types'

import Styles from './WithSideNav.css'


const WithSideNav = ({ children, navComponents }) => {
  return (
    <div className={Styles.container}>
      <div className={Styles.nav}>{navComponents}</div>
      <div className={Styles.content}>{children}</div>
    </div>
  )
}

WithSideNav.propTypes = {
  children: PropTypes.any.isRequired,
  navComponents: PropTypes.any,
}

export default WithSideNav
