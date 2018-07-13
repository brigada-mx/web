import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import { parseQs } from 'tools/string'
import ModalQsTestimonial from './ModalQsTestimonial'


/**
 * Component that parses query string and dispatches a modal action, or renders a
 * component whose only responsibility is to dispatch a modal action. This
 * component should only be updated when the browser's location changes.
 */
class ModalQsSelector extends React.Component {
  componentDidMount() {
    this.setModalRedux()
  }

  componentDidUpdate() {
    this.setModalRedux()
  }

  setModalRedux = () => {
    const { location, modal, closeModal } = this.props
    const { _mn: modalName } = parseQs(location.search)
    if (!modalName) closeModal()
    if (modalName === 'support') modal('support')
  }

  render() {
    const { location } = this.props
    const { _mn: modalName, _ms: modalPropsString } = parseQs(location.search)
    if (modalName === 'testimonial') return <ModalQsTestimonial modalPropsString={modalPropsString} />
    return null
  }
}

ModalQsSelector.propTypes = {
  modal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
    closeModal: () => Actions.modal(dispatch, ''),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(ModalQsSelector))
