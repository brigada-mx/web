import React from 'react'
import PropTypes from 'prop-types'

import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import Styles from './DonorListScreenView.css'


class DonorListScreenView extends React.Component {
  componentDidMount() {
    document.title = 'Donadores - Brigada'
  }

  render() {
    const { donors: { data: donorData, loading: donorLoading, error: donorError } } = this.props

    const donors = donorData ? donorData.results : []

    if (donorLoading) return <LoadingIndicatorCircle className={Styles.loader} />
    return <div>Donadores</div>
  }
}

DonorListScreenView.propTypes = {
  donors: PropTypes.object.isRequired,
}

export default DonorListScreenView
