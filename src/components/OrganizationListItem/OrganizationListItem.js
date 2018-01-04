import React from 'react'
import PropTypes from 'prop-types'

import { fmtNum, fmtBudget } from 'tools/string'
import Styles from './OrganizationListItem.css'


const OrganizationListItem = ({ organization, onClick, onMouseEnter, onMouseLeave }) => {
  const {
    name, tag1, tag2, tag3, mission, investment, projects, photos,
  } = organization

  const handleClick = () => { onClick(organization) }
  const handleMouseEnter = () => { onMouseEnter(organization) }
  const handleMouseLeave = () => { onMouseLeave(organization) }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={Styles.orgCard}
    >
      <div className={Styles.descriptionContainer}>
        <span className={Styles.name}>{name}</span>
        <div className={Styles.tagContainer}>
          <span className={Styles.tag}>{tag1}</span>
          <span className={Styles.tag}>{tag2}</span>
          <span className={Styles.tag}>{tag3}</span>
        </div>
        <span className={Styles.mission}>{mission}</span>
      </div>
      <div className={Styles.metricsContainer}>
        <div className={Styles.metric}>
          <span className={Styles.label}>Inversión<br />estimada</span>
          <span className={Styles.value}>{fmtBudget(investment)}</span>
        </div>
        <div className={Styles.metric}>
          <span className={Styles.label}>Proyectos<br />registrados</span>
          <span className={Styles.value}>{projects}</span>
        </div>
        <div className={Styles.metric}>
          <span className={Styles.label}>Fotos<br />capturados</span>
          <span className={Styles.value}>{photos}</span>
        </div>
      </div>
    </div>
  )
}

OrganizationListItem.propTypes = {
  organization: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
}

OrganizationListItem.defaultProps = {
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
}

export default OrganizationListItem
