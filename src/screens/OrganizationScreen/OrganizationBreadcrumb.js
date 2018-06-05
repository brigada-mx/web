import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { sectorByValue, projectTypeByValue } from 'src/choices'

import Styles from './OrganizationScreenView.css'


const OrganizationBreadcrumb = ({ name, sector, id, projectType, actionId, position }) => {
  const leadingLinks = () => {
    if (position && window.innerWidth < 768) return null
    return (
      <React.Fragment>
        <span className={Styles.orgList}><Link to="/reconstructores">Reconstructores</Link></span>
        <span className={Styles.sector}>
          <Link to={`/reconstructores?sec=${sector}`}>{sectorByValue[sector] || sector}</Link>
        </span>
      </React.Fragment>
    )
  }
  const optionalLinks = () => {
    if (!projectType) return null
    if (!position) {
      return <span className={Styles.projectType}><Link to="#">{projectTypeByValue[projectType] || projectType}</Link></span>
    }
    return (
      <React.Fragment>
        <span className={Styles.projectType}><Link to={`/proyectos/${actionId}`}>{projectTypeByValue[projectType] || projectType}</Link></span>
        <span className={Styles.projectType}><Link to="#">{position}</Link></span>
      </React.Fragment>
    )
  }

  return (
    <div className={Styles.breadcrumbLinks}>
      {leadingLinks()}

      <span className={Styles.orgDetail}>
        <Link to={`/reconstructores/${id}`}>{name}</Link>
      </span>

      {optionalLinks()}
    </div>
  )
}

OrganizationBreadcrumb.propTypes = {
  name: PropTypes.string.isRequired,
  sector: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  projectType: PropTypes.string,
  actionId: PropTypes.number,
  position: PropTypes.string,
}

export default OrganizationBreadcrumb
