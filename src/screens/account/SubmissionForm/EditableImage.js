import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import Toggle from 'material-ui/Toggle'
import IconButton from 'material-ui/IconButton'
import RotateLeft from 'material-ui/svg-icons/image/rotate-left'
import RotateRight from 'material-ui/svg-icons/image/rotate-right'

import * as Actions from 'src/actions'
import service from 'api/service'
import { thumborUrl, imageStyleObject } from 'tools/string'
import FormStyles from 'src/Form.css'
import Styles from './SubmissionForm.css'


class EditableImage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      submitting: false,
    }
  }

  handleSubmit = async (body) => {
    this.setState({ submitting: true })

    const { snackbar, submissionId: id, image: { url } } = this.props
    const { data } = await service.accountUpdateSubmissionImage(id, { ...body, url })
    if (!data) {
      snackbar('No se pudo editar esta foto', 'error')
      this.setState({ submitting: false })
      return
    }

    this.setState({ submitting: false })
    let message
    if (body.published === true) message = 'Publicaste esta foto'
    if (body.published === false) message = 'Ocultaste esta foto'
    if (body.rotate === 'left') message = 'Rotaste la foto a la izquierda'
    if (body.rotate === 'right') message = 'Rotaste la foto a la derecha'
    snackbar(message, 'success')
    this.props.onUpdate(body)
  }

  render() {
    const { image } = this.props
    const { submitting } = this.state
    const published = !image.hidden

    return (
      <div className={Styles.thumbnailContainer}>
        <a
          className={Styles.thumbnail}
          style={{
            backgroundImage: `url("${thumborUrl(image, 480, 480, { crop: true, rotate: false })}")`,
            ...imageStyleObject(image),
          }}
          href={thumborUrl(image, 1280, 1280)}
          target="_blank"
          rel="noopener noreferrer"
        />
        <div className={FormStyles.row}>
          <Toggle
            className={Styles.thumbnailButton}
            style={{ maxWidth: 40 }}
            disabled={submitting}
            toggled={published}
            onToggle={(e, toggled) => this.handleSubmit({ published: toggled })}
          />
          <IconButton
            className={Styles.thumbnailButton}
            disabled={submitting}
            onClick={() => this.handleSubmit({ rotate: 'left' })}
          >
            <RotateLeft />
          </IconButton>
          <IconButton
            className={Styles.thumbnailButton}
            disabled={submitting}
            onClick={() => this.handleSubmit({ rotate: 'right' })}
          >
            <RotateRight />
          </IconButton>
        </div>
      </div>
    )
  }
}

EditableImage.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  image: PropTypes.object.isRequired,
  submissionId: PropTypes.number.isRequired,
  snackbar: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(null, mapDispatchToProps)(EditableImage)
