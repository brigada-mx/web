import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import Modal from 'components/Modal'
import WithSideNav from 'components/WithSideNav'
import FormStyles from 'src/Form.css'
import DonorForm from './DonorForm'


class DonorHomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    document.title = 'Donador - Brigada'
    this.loadDonor()
  }

  loadDonor = () => {
    getBackoff(service.donorGetDonor, { key: 'donorDonor' })
  }

  handleSubmitDonor = async (values) => {
    const { data } = await service.donorUpdateDonor(values)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadDonor()
    this.props.snackbar('Actualizaste información de donador', 'success')
  }

  render() {
    return (
      <WithSideNav>
        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>Donador</div>
          <DonorForm onSubmit={this.handleSubmitDonor} enableReinitialize />
        </div>
      </WithSideNav>
    )
  }
}

DonorHomeScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(null, mapDispatchToProps)(DonorHomeScreen)
