import React from 'react'
import PropTypes from 'prop-types'

import Styles from './WithSideNav.css'


const WithSideNav = ({ children, navComponents, sticky = true }) => {
  const navClass = sticky ? Styles.navSticky : Styles.nav
  return (
    <div className={Styles.container}>
      <div className={navClass}>
        <div className={Styles.innerNav}>{navComponents}</div>
      </div>
      <div className={Styles.content}>{children}</div>
    </div>
  )
}

WithSideNav.propTypes = {
  children: PropTypes.any.isRequired,
  navComponents: PropTypes.any,
  sticky: PropTypes.bool,
}

export default WithSideNav
