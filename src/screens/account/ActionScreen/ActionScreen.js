import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { cleanAccentedChars } from 'tools/string'
import Modal from 'components/Modal'
import { UpdateActionForm, prepareActionBody, prepareInitialActionValues } from 'screens/account/ActionForm'
import DonationsForm, { prepareDonationBody, prepareInitialDonationValues } from 'screens/account/DonationsForm'
import SubmissionForm from 'screens/account/SubmissionForm'
import SubmissionTable from 'screens/account/SubmissionTable'
import FormStyles from 'screens/account/Form.css'
import Styles from './ActionScreen.css'


class ActionScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localitiesSearch: [],
      submissionId: undefined,
    }

    this.handleLocalityChange = _.debounce(
      this.handleLocalityChange, 250
    )
  }

  componentDidMount() {
    this.loadAction()
    this.loadDonors()
  }

  loadAction = () => {
    const { actionKey } = this.props
    getBackoff(() => { return service.getAccountAction(actionKey) }, { key: `accountAction_${actionKey}` })
  }

  loadDonors = () => {
    getBackoff(service.getDonors, { key: 'donors' })
  }

  handleUpdateAction = async (body) => {
    const { id } = this.props.action
    if (!id) return

    const { data } = await service.updateAccountAction(id, prepareActionBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    this.props.snackbar('Actualizaste tu proyecto', 'success')
  }

  handleLocalityChange = async (e, v) => {
    if (v.value) {
      this.setState({ localitiesSearch: [] })
      return
    }
    const { data } = await service.getLocalitiesSearch(cleanAccentedChars(v.text), 10)
    if (!data) return
    this.setState({ localitiesSearch: data.results })
  }

  handleTogglePublishedSubmission = async (id, published) => {
    const { data } = await service.updateAccountSubmission(id, { published })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${published ? 'publicar' : 'ocultar'} estas fotos`, 'error')
      return
    }
    this.loadAction()
    const message = published ? 'Publicaste estas fotos' : 'Ocultaste estas fotos'
    this.props.snackbar(message, 'success')
  }

  handleRowClickedSubmission = (id) => {
    this.setState({ submissionId: id })
  }

  handleModalClose = async () => {
    this.setState({ submissionId: undefined })
  }

  handleSubmitDonations = async ({ donations }) => {
    // find new, deleted and updated instances
    const { snackbar } = this.props
    const { action } = this.props
    if (!action.donations) {
      snackbar('Hubo un error', 'error')
      return
    }

    const newIds = new Set(donations.map(d => d.id))
    const prepared = donations.map(d => prepareDonationBody(d))
    const results = []

    for (const d of prepared) {
      if (d.id === undefined) {
        results.push(service.createAccountDonation({ ...d, action: action.id }))
      } else {
        const old = _.find(action.donations, o => o.id === d.id)
        if (!old) {
          snackbar('Hubo un error', 'error')
          return
        }
        if (old.amount === d.amount &&
          old.received_date === d.received_date && old.donor.id === d.donor) continue
        results.push(service.updateAccountDonation(d.id, d))
      }
    }
    for (const d of action.donations) {
      if (!newIds.has(d.id)) results.push(service.deleteAccountDonation(d.id))
    }
    let errors = 0
    for (const result of await Promise.all(results)) {
      if (!result.data) errors += 1
    }
    if (!errors) snackbar('Se guardaron todos los cambios', 'success')
    else snackbar(`No se guardaron todos los cambios, hubo ${errors} error(es)`, 'error')
    this.loadAction()
    this.loadDonors()
  }

  render() {
    const { action, donors, donations } = this.props
    const { submissions = [] } = action
    const { submissionId, localitiesSearch } = this.state

    return (
      <div>
        <div className={FormStyles.sectionHeader}>Actualizar proyecto</div>
        {action.id &&
          <div className={FormStyles.formContainerLeft}>
            <UpdateActionForm
              onSubmit={this.handleUpdateAction}
              initialValues={action}
              onLocalityChange={this.handleLocalityChange}
              localitiesSearch={localitiesSearch}
              form={`accountUpdateAction_${this.props.actionKey}`}
              enableReinitialize
            />
          </div>
        }

        {submissions.length > 0 &&
          <React.Fragment>
            <div className={FormStyles.sectionHeader}>Fotos</div>
            <SubmissionTable
              submissions={submissions}
              onTogglePublished={this.handleTogglePublishedSubmission}
              onRowClicked={this.handleRowClickedSubmission}
            />
          </React.Fragment>
        }

        {submissionId !== undefined &&
          <Modal className={Styles.modal} onClose={this.handleModalClose} gaName={`submission/${submissionId}`}>
            <SubmissionForm submissionId={submissionId} />
          </Modal>
        }

        <div className={FormStyles.sectionHeader}>Donaciones</div>
        <div className={FormStyles.formContainerLeft}>
          <DonationsForm
            onSubmit={this.handleSubmitDonations}
            initialValues={donations}
            donorsSearch={donors}
            form={`accountActionDonations_${this.props.actionKey}`}
            enableReinitialize
          />
        </div>
      </div>
    )
  }
}

ActionScreen.propTypes = {
  donors: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.object.isRequired,
  donations: PropTypes.object.isRequired,
  actionKey: PropTypes.number.isRequired,
  snackbar: PropTypes.func.isRequired,
}

const mapStateToProps = (state, props) => {
  const { actionKey } = props
  let action = {}
  let donors = []
  const donations = { donations: [] }

  try {
    action = prepareInitialActionValues(state.getter[`accountAction_${actionKey}`].data || {})
    donations.donations = action.donations.map(d => prepareInitialDonationValues(d))
  } catch (e) {}
  try {
    donors = state.getter.donors.data.results || []
  } catch (e) {}

  return { action, donations, donors }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionScreen)
