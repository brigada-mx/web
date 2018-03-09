import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import ActionTable from 'screens/account/ActionTable'
import FormStyles from 'screens/account/Form.css'


class ActionTrash extends React.Component {
  componentDidMount() {
    this.loadActions()
  }

  loadActions = () => {
    getBackoff(() => service.getAccountActions(true), { key: 'accountActionsTrash' })
  }

  handleRestore = async (id, key) => {
    const { data } = await service.archiveAccountAction(id, false)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadActions()
    this.props.snackbar(`Restauraste proyecto ${key}`, 'success')
    if (this.props.onRestore) this.props.onRestore(id, key)
  }

  render() {
    return (
      <React.Fragment>
        <div className={FormStyles.sectionHeader}>Proyectos borrados</div>
        <ActionTable actions={this.props.actions} onRestore={this.handleRestore} />
      </React.Fragment>
    )
  }
}

ActionTrash.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  snackbar: PropTypes.func.isRequired,
  onRestore: PropTypes.func,
}

const mapStateToProps = (state) => {
  try {
    return { actions: state.getter.accountActionsTrash.data.results }
  } catch (e) {
    return { actions: []}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionTrash)
