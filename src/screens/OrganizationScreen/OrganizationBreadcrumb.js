import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import Styles from './OrganizationScreenView.css'


const OrganizationBreadcrumb = ({ name, sector, id, projectType }) => {
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
        <Link to={`/reconstructores/${id}`}>{name}</Link>
      </span>
      {projectType && <span className={Styles.projectType}><Link to="#">{projectType}</Link></span>}
    </div>
  )
}

OrganizationBreadcrumb.propTypes = {
  name: PropTypes.string.isRequired,
  sector: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  projectType: PropTypes.string,
}

export default OrganizationBreadcrumb
