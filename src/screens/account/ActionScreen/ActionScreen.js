import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import { cleanAccentedChars } from 'tools/string'
import { UpdateActionForm, prepareActionBody, prepareInitialValues } from 'screens/account/ActionForm'
import FormStyles from 'screens/account/Form.css'
import Styles from './ActionScreen.css'


class ActionScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localitiesSearch: [],
    }

    this.handleLocalityChange = _.debounce(
      this.handleLocalityChange, 250
    )
  }

  componentDidMount() {
    this.loadAction()
    this.loadActions()
  }

  loadAction = () => {
    const { actionKey } = this.props
    getBackoff(() => { return service.getAccountAction(actionKey) }, { key: `accountAction_${actionKey}` })
  }

  loadActions = () => {
    getBackoff(service.getAccountActionsMinimal, { key: 'accountActionsMinimal' })
  }

  handleUpdateAction = async (body) => {
    const { id } = this.props.initialActionValues
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

  render() {
    const { initialActionValues } = this.props
    return (
      <div>
        <div className={FormStyles.sectionHeader}>Actualizar proyecto</div>
        { initialActionValues.id &&
        <div className={FormStyles.formContainerLeft}>
          <UpdateActionForm
            onSubmit={this.handleUpdateAction}
            initialValues={initialActionValues}
            onLocalityChange={this.handleLocalityChange}
            localitiesSearch={this.state.localitiesSearch}
            form={`accountUpdateAction_${this.props.actionKey}`}
            enableReinitialize
          />
        </div>
        }
      </div>
    )
  }
}

ActionScreen.propTypes = {
  initialActionValues: PropTypes.object.isRequired,
  actionKey: PropTypes.number.isRequired,
  snackbar: PropTypes.func.isRequired,
}

const mapStateToProps = (state, props) => {
  const { actionKey } = props
  try {
    return {
      initialActionValues: prepareInitialValues(state.getter[`accountAction_${actionKey}`].data || {}),
    }
  } catch (e) {
    return { initialActionValues: {} }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionScreen)
