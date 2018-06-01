import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import Styles from './ChooseVolunteerOpportunity.css'


class ChooseVolunteerOpportunity extends React.Component {
  componentDidMount() {
    const { actionId } = this.props
    getBackoff(() => service.getAction(actionId), { key: `action_${actionId}` })
  }

  handleOpportunityClick = (id) => {
    const { history, closeModal } = this.props
    history.push(`/voluntariado/${id}`)
    closeModal()
  }

  render() {
    const { action, history, closeModal } = this.props
    if (!action) return <LoadingIndicatorCircle />
    if (action.opportunities.length === 0) return <LoadingIndicatorCircle />
    if (action.opportunities.length === 1) {
      history.push(`/voluntariado/${action.opportunities[0].id}`)
      closeModal()
      return null
    }

    const options = action.opportunities.map((o, i) => {
      const { id, position } = o
      return <li className={Styles.link} key={i} onClick={() => this.handleOpportunityClick(id)}>{position}</li>
    })
    return (
      <React.Fragment>
        <div className={Styles.header}>¿Cuál oportunidad te interesa?</div>
        <ul className={Styles.list}>
          {options}
        </ul>
      </React.Fragment>
    )
  }
}

ChooseVolunteerOpportunity.propTypes = {
  actionId: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  action: PropTypes.object,
}

const mapStateToProps = (state, { actionId }) => {
  try {
    return { action: state.getter[`action_${actionId}`].data }
  } catch (e) {
    return {}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => Actions.modal(dispatch, ''),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChooseVolunteerOpportunity))
