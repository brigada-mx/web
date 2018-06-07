import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import WithSideNav from 'components/WithSideNav'
import BackButton from 'components/BackButton'
import { UpdateDonationForm, prepareDonationBody, prepareInitialDonationValues } from 'screens/account/DonorDonationForm'
import FormStyles from 'src/Form.css'


class DonationScreen extends React.Component {
  componentDidMount() {
    document.title = `Donativo ${this.props.id} - Brigada`
    this.loadDonation()
  }

  loadDonation = () => {
    const { id } = this.props
    getBackoff(() => { return service.donorGetDonation(id) }, { key: `donorDonation_${id}` })
  }

  handleUpdateDonation = async (body) => {
    const { id } = this.props
    if (!id) return

    const { data } = await service.donorUpdateDonation(id, prepareDonationBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadDonation()
    this.props.snackbar('Actualizaste tu donativo', 'success')
  }

  handleDeleteDonation = async () => {
    const { data } = await service.donorDeleteDonation(this.props.id, true)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.snackbar(`Borraste donativo ${this.props.id}`, 'success')
    this.props.history.push('/donador')
  }

  render() {
    const { donation, status } = this.props
    if (status === 404) return <Redirect to="/donador" />

    const content = (
      <div>
        {donation.id &&
          <div className={FormStyles.card}>
            <div className={FormStyles.formContainerLeft}>
              <UpdateDonationForm
                onSubmit={this.handleUpdateDonation}
                initialValues={donation}
                form={`donorUpdateDonation_${this.props.id}`}
                enableReinitialize
                onDelete={this.handleDeleteDonation}
              />
            </div>
          </div>
        }
      </div>
    )
    return <WithSideNav navComponents={<BackButton to="/donador" />}>{content}</WithSideNav>
  }
}

DonationScreen.propTypes = {
  donation: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  snackbar: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  status: PropTypes.number,
}

const mapStateToProps = (state, props) => {
  const { id } = props
  let donation = {}

  const reduxDonation = state.getter[`donorDonation_${id}`]
  const status = reduxDonation && reduxDonation.status
  try {
    donation = prepareInitialDonationValues(reduxDonation.data || {})
  } catch (e) {}

  return { donation, status }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DonationScreen))
