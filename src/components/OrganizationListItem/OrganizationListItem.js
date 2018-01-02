import React from 'react'
import PropTypes from 'prop-types'

import Styles from './OrganizationListItem.css'


const OrganizationListItem = ({ organization, onClick, onMouseEnter, onMouseLeave }) => {
  const {
    name, state_name: stateName, action_count: actions,
  } = organization

  const handleClick = () => { onClick(organization) }
  const handleMouseEnter = () => { onMouseEnter(organization) }
  const handleMouseLeave = () => { onMouseLeave(organization) }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={Styles.listItem}
    >
      <div className={Styles.listItemWrapper}>
        <div className={`${Styles.listItemHeader}`}>
          <div className={Styles.name}>{name},</div>
          <div className={Styles.stateName}>
        </div>

        <div className={Styles.listItemMetricsContainer}>
          <div className={`${Styles.listItemMetrics} ${Styles.act}`}>
            <span className={Styles.value}>{actions}</span>
            <span className={Styles.label}>Acciones registradas</span>
          </div>
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
