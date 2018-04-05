import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import Styles from './DonorScreenView.css'


const DonorBreadcrumb = ({ name }) => {
  return (
    <div className={Styles.breadcrumbLinks}>
      <span className={Styles.donorList}><Link to="/donadores">Donadores</Link></span>
      <span className={Styles.donorDetail}>
        <Link to="#">{name}</Link>
      </span>
    </div>
  )
}

DonorBreadcrumb.propTypes = {
  name: PropTypes.string.isRequired,
}

export default DonorBreadcrumb
