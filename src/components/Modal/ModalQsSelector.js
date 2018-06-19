import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { parseQs } from 'tools/string'
import ModalQsTestimonial from 'components/ModalQsTestimonial'
import Modal from './Modal'
import Styles from './Modal.css'


const ModalQsSelector = ({ modalName, modalPropsString }) => {
  if (modalName === 'testimonial') {
    return (
      <Modal contentClassName={Styles.selectorContent} transparent>
        <ModalQsTestimonial modalPropsString={modalPropsString} />
      </Modal>
    )
  }
  return null
}

ModalQsSelector.propTypes = {
  modalName: PropTypes.string,
  modalPropsString: PropTypes.string,
}

const mapStateToProps = (state, { location }) => {
  const { _mn: modalName, _ms: modalPropsString } = parseQs(location.search)
  return { modalName, modalPropsString }
}

export default withRouter(connect(mapStateToProps, null)(ModalQsSelector))
