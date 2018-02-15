import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import * as Actions from 'src/actions'
import Styles from './OrganizationScreenView.css'


const OrganizationBreadcrumb = ({ name, sector, onChangeFilter }) => {
  const labelBySector = {
    civil: 'Civil',
    public: 'Público',
    private: 'Privado',
    religious: 'Religioso',
  }

  const handleClick = () => {
    onChangeFilter('valSector', [{ value: sector, label: labelBySector[sector] }])
  }

  return (
    <div className={Styles.breadcrumbLinks}>
      <span className={Styles.orgList}><Link to="/organizaciones">Organizaciones</Link></span>
      <span className={Styles.sector}>
        <Link
          to={{ pathname: '/organizaciones' }}
          onClick={handleClick}
        >
          {labelBySector[sector]}
        </Link>
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
  onChangeFilter: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeFilter: (prop, values) => Actions.filterOrganizations(dispatch, { prop, values }),
  }
}

export default connect(null, mapDispatchToProps)(OrganizationBreadcrumb)
