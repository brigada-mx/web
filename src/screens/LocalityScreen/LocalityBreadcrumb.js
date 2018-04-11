import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import Styles from './LocalityScreenView.css'


const LocalityBreadcrumb = ({ cvegeo, stateName, munName, name }) => {
  return (
    <div className={Styles.breadcrumbLinks}>
      <span className={Styles.communities}><Link to="/">Comunidades</Link></span>
      <span className={Styles.state}>
        <Link to={`/?est=${cvegeo.substring(0, 2)}`}>{stateName}</Link>
      </span>
      <span className={Styles.muni}>
        <Link to={`/?mun=${cvegeo.substring(0, 5)}`}>{munName}</Link>
      </span>
      <span className={Styles.loc}>
        <Link to="#">{name}</Link>
      </span>
    </div>
  )
}

LocalityBreadcrumb.propTypes = {
  cvegeo: PropTypes.string.isRequired,
  stateName: PropTypes.string.isRequired,
  munName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default LocalityBreadcrumb
