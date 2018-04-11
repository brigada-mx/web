import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import Styles from './OrganizationScreenView.css'


const OrganizationBreadcrumb = ({ name, sector }) => {
  const labelBySector = {
    civil: 'Civil',
    public: 'Público',
    private: 'Privado',
    religious: 'Religioso',
  }

  return (
    <div className={Styles.breadcrumbLinks}>
      <span className={Styles.orgList}><Link to="/reconstructores">Reconstructores</Link></span>
      <span className={Styles.sector}>
        <Link to={`/reconstructores?sec=${sector}`}>{labelBySector[sector]}</Link>
      </span>
      <span className={Styles.orgDetail}>
        <Link to="#">{name}</Link>
      </span>
    </div>
  )
}

OrganizationBreadcrumb.propTypes = {
  name: PropTypes.string.isRequired,
  sector: PropTypes.string.isRequired,
}

export default OrganizationBreadcrumb
