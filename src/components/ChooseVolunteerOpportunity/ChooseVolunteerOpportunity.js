import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

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
    this.props.modal('volunteerOpportunity', { id, modalWide: true })
  }

  render() {
    const { action } = this.props
    if (!action) return <LoadingIndicatorCircle />
    if (action.opportunities.length === 0) return <LoadingIndicatorCircle />
    if (action.opportunities.length === 1) {
      this.props.modal('volunteerOpportunity', { id: action.opportunities[0].id, modalWide: true })
      return null
    }

    const options = action.opportunities.map((o, i) => {
      const { id, position } = o
      return <div className={Styles.link} key={i} onClick={() => this.handleOpportunityClick(id)}>{position}</div>
    })
    return (
      <React.Fragment>
        <div className={Styles.header}>¿Cuál oportunidad te interesa?</div>
        {options}
      </React.Fragment>
    )
  }
}

ChooseVolunteerOpportunity.propTypes = {
  actionId: PropTypes.number.isRequired,
  modal: PropTypes.func.isRequired,
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
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseVolunteerOpportunity)
