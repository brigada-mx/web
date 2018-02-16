import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import * as Actions from 'src/actions'
import Styles from './LocalityScreenView.css'


const LocalityBreadcrumb = ({ cvegeo, stateName, munName, name, onChangeFilter }) => {
  const handleClickState = () => {
    onChangeFilter('valState', [{ value: cvegeo.substring(0, 2), label: stateName }])
    onChangeFilter('valMuni', [])
  }

  const handleClickMun = () => {
    onChangeFilter('valState', [])
    onChangeFilter('valMuni', [{ value: cvegeo.substring(0, 5), label: munName }])
  }

  return (
    <div className={Styles.breadcrumbLinks}>
      <span className={Styles.communities}><Link to="/">Comunidades</Link></span>
      <span className={Styles.state}>
        <Link
          to={{ pathname: '/' }}
          onClick={handleClickState}
        >
          {stateName}
        </Link>
      </span>
      <span className={Styles.muni}>
        <Link
          to={{ pathname: '/' }}
          onClick={handleClickMun}
        >
          {munName}
        </Link>
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
  onChangeFilter: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeFilter: (prop, values) => Actions.filterLocalities(dispatch, { prop, values }),
  }
}

export default connect(null, mapDispatchToProps)(LocalityBreadcrumb)
