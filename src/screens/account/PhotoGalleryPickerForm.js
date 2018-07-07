import React from 'react'
import PropTypes from 'prop-types'
import lifecycle from 'recompose/lifecycle'

import { connect } from 'react-redux'
import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'

import service, { getBackoff } from 'api/service'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import { PhotoGalleryPicker } from 'components/Fields'


const PhotoGalleryPickerForm = ({ handleSubmit, action: { submissions, testimonials } = {} }) => {
  if (!submissions && !testimonials) return <LoadingIndicatorCircle />

  const handleChange = () => {
    // this is bug-prone: if form doesn't update before `handleSubmit` is called, old form values are passed
    setTimeout(handleSubmit, 500)
  }

  return (
    <PhotoGalleryPicker
      name="preview"
      testimonials={testimonials}
      submissions={submissions}
      columns={4}
      onChange={handleChange}
    />
  )
}

PhotoGalleryPickerForm.propTypes = {
  ...rxfPropTypes,
  actionId: PropTypes.number.isRequired,
  action: PropTypes.object,
}

const mapStateToProps = (state, { actionId }) => {
  try {
    return { action: state.getter[`action_${actionId}`].data }
  } catch (e) {
    return {}
  }
}

export default lifecycle({
  componentDidMount() {
    const { actionId } = this.props
    getBackoff(() => service.getAction(actionId), { key: `action_${actionId}` })
  },
})(connect(mapStateToProps, null)(reduxForm()(PhotoGalleryPickerForm)))
