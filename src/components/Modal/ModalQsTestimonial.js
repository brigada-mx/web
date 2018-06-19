import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import service, { getBackoff } from 'api/service'
import * as Actions from 'src/actions'


class ModalQsTestimonial extends React.Component {
  componentDidMount() {
    this._mounted = true

    const { modal, modalPropsString } = this.props
    const id = Number.parseInt(modalPropsString, 10)
    if (Number.isNaN(id)) return

    getBackoff(() => service.getTestimonial(id), {
      onResponse: ({ data, error }) => {
        if (error) modal('youTubeVideo', { modalTransparent: true, videoId: '_' })
        if (data) modal('youTubeVideo', { modalTransparent: true, videoId: data.video.youtube_video_id })
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
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default connect(null, mapDispatchToProps)(ModalQsTestimonial)
