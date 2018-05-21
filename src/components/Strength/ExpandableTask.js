import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import Styles from './Strength.css'


class ExpandableTask extends React.Component {
  state = { open: this.props.open }

  static getDerivedStateFromProps({ open }, { open: _open } = {}) {
    if (open !== undefined && open !== _open) return { open }
    return null
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  openVideoModal = () => {
    this.props.modal('youTubeVideo', { modalTransparent: true, videoId: this.props.videoId })
  }

  render() {
    const { value, label, videoId, durationString } = this.props
    const { open } = this.state

    let classNames
    if (videoId) classNames = open ? Styles.open : Styles.closed
    else classNames = Styles.noVideo
    const checkbox = (
      <div className={classNames} onClick={this.toggleOpen}>
        <span className={`${Styles.checkbox} ${value ? Styles.done : Styles.notDone}`} />
        <span className={Styles.taskLabel}>{label}</span>
      </div>
    )

    if (!open || !videoId) return checkbox
    return (
      <React.Fragment>
        {checkbox}
        <div className={Styles.tutorial} onClick={this.openVideoModal}>
          <div className={Styles.tutorialIcon} />
          <span className={Styles.tutorialMeta}>Tutorial {durationString ? `(${durationString})` : ''}</span>
        </div>
      </React.Fragment>
    )
  }
}

ExpandableTask.propTypes = {
  value: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  open: PropTypes.bool,
  videoId: PropTypes.string,
  durationString: PropTypes.string,
  modal: PropTypes.func.isRequired,
}

ExpandableTask.defaultProps = {
  open: false,
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default connect(null, mapDispatchToProps)(ExpandableTask)
