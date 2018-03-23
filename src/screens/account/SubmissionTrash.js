import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import SubmissionTable from 'screens/account/SubmissionTable'
import FormStyles from 'src/Form.css'


class SubmissionTrash extends React.Component {
  componentDidMount() {
    this.loadSubmissions()
  }

  loadSubmissions = () => {
    getBackoff(() => service.getAccountSubmissions(undefined, true),
      { key: 'accountSubmissionsTrash' })
  }

  handleRestore = async (id) => {
    const { data } = await service.archiveAccountSubmission(id, false)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadSubmissions()
    this.props.snackbar('Restauraste estas fotos, regresa a la página principal para asignarlas a un proyecto', 'success')
    if (this.props.onRestore) this.props.onRestore(id)
  }

  render() {
    return (
      <React.Fragment>
        <div className={FormStyles.sectionHeader}>Fotos borradas</div>
        <SubmissionTable submissions={this.props.submissions} onRestore={this.handleRestore} />
      </React.Fragment>
    )
  }
}

SubmissionTrash.propTypes = {
  submissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  snackbar: PropTypes.func.isRequired,
  onRestore: PropTypes.func,
}

const mapStateToProps = (state) => {
  try {
    return { submissions: state.getter.accountSubmissionsTrash.data.results }
  } catch (e) {
    return { submissions: []}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionTrash)
