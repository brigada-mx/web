import React from 'react'
import PropTypes from 'prop-types'

import { reset } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import Modal from 'components/Modal'
import WithSideNav from 'components/WithSideNav'
import DonorDonationTable from 'screens/account/DonorDonationTable'
import { CreateDonationForm, prepareDonationBody } from 'screens/account/DonorDonationForm'
import FormStyles from 'src/Form.css'
import DonorForm from './DonorForm'


const initialDonationValues = { approved_by_donor: true, approved_by_org: false }

class DonorHomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      createDonationModal: false,
    }
  }

  componentDidMount() {
    document.title = 'Donador - Brigada'
    this.loadDonor()
    this.loadDonations()
  }

  loadDonor = () => {
    getBackoff(service.donorGetDonor, { key: 'donorDonor' })
  }

  loadDonations = () => {
    getBackoff(service.donorGetDonations, { key: 'donorDonations' })
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

  handleToggleApproved = async (id, approved) => {
    const { data } = await service.donorUpdateDonation(id, { approved_by_donor: approved })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${approved ? 'aprobar' : 'ocultar'} esta donación`, 'error')
      return
    }
    this.loadDonations()
    const message = approved ? `Aprobaste donación ${id}` : `Ocultaste donación ${id}`
    this.props.snackbar(message, 'success')
  }

  handleCreateDonation = async (body) => {
    const { data } = await service.donorCreateDonation(prepareDonationBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.resetDonation()
    this.loadDonations()
    this.props.snackbar('Agregaste una nueva donación', 'success')
    this.handleToggleCreateDonationModal(false)
  }

  handleToggleCreateDonationModal = (open) => {
    this.setState({ createDonationModal: open })
  }

  render() {
    const { donations } = this.props
    const { createDonationModal } = this.state
    return (
      <WithSideNav>
        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>Donador</div>
          <DonorForm onSubmit={this.handleSubmitDonor} enableReinitialize />
        </div>

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>
            <span>Donaciones</span>
            <div>
              <RaisedButton
                backgroundColor="#3DC59F"
                labelColor="#ffffff"
                className={FormStyles.primaryButton}
                label="AGREGAR"
                onClick={() => this.handleToggleCreateDonationModal(true)}
              />
            </div>
          </div>
          {donations.length > 0 &&
            <DonorDonationTable
              donations={donations}
              onToggleApproved={this.handleToggleApproved}
            />
          }
        </div>

        {createDonationModal &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={() => this.handleToggleCreateDonationModal(false)}
            gaName="donorCreateDonationModal"
          >
            <div className={FormStyles.sectionHeader}>Agregar donación</div>
            <CreateDonationForm
              onSubmit={this.handleCreateDonation}
              initialValues={initialDonationValues}
              onLocalityChange={this.handleLocalityChange}
            />
          </Modal>
        }
      </WithSideNav>
    )
  }
}

DonorHomeScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
  donations: PropTypes.arrayOf(PropTypes.object).isRequired,
  resetDonation: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  try {
    return { donations: state.getter.donorDonations.data.results || [] }
  } catch (e) {
    return { donations: [] }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    resetDonation: () => dispatch(reset('donorNewDonation')),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorHomeScreen)
