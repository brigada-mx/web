import React from 'react'
import PropTypes from 'prop-types'
import lifecycle from 'recompose/lifecycle'

import { connect } from 'react-redux'

import service, { getBackoff } from 'api/service'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import Styles from './VolunteerOpportunityListScreen.css'


const VolunteerOpportunityListScreen = ({ opportunities }) => {
  if (!opportunities) return <LoadingIndicatorCircle />
  return null
}

VolunteerOpportunityListScreen.propTypes = {
  opportunities: PropTypes.arrayOf(PropTypes.object),
}

const mapStateToProps = (state) => {
  try {
    return { opportunities: state.getter.opportunities.data.results }
  } catch (e) {
    return {}
  }
}

export default lifecycle({
  componentDidMount() {
    getBackoff(service.getOpportunities, { key: 'opportunities' })
  },
})(connect(mapStateToProps, null)(VolunteerOpportunityListScreen))
