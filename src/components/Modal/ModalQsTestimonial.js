import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import service, { getBackoff } from 'api/service'
import * as Actions from 'src/actions'


class ModalQsTestimonial extends React.Component {
  componentDidMount() {
    this._mounted = true

    const { modal, modalPropsString, location } = this.props
    const id = Number.parseInt(modalPropsString, 10)
    if (Number.isNaN(id)) return

    const errorModal = () => { modal('youTubeVideo', { modalTransparent: true, videoId: '_' }) }

    getBackoff(() => service.getTestimonial(id), {
      onResponse: ({ data, error }) => {
        if (!this._mounted) return
        if (error) errorModal()
        if (data) {
          const parts = location.pathname.split('/')
          if (parts[1] !== 'proyectos') errorModal()
          else if (Number.parseInt(parts[2], 10) !== data.action) errorModal()
          else modal('testimonialVideo', { modalTransparent: true, modalTransparentBackground: false, testimonial: data })
        }
      },
    })
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    return null
  }
}

ModalQsTestimonial.propTypes = {
  modal: PropTypes.func.isRequired,
  modalPropsString: PropTypes.string,
  location: PropTypes.object.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(ModalQsTestimonial))
