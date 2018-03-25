import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import Snackbar from 'material-ui/Snackbar'

import { connect } from 'react-redux'
import colors from 'src/colors'


const snackBarRoot = document.getElementById('snackbar')

class SnackBar extends React.PureComponent {
  handleRequestClose = (reason) => {
    if (reason === 'clickaway') return undefined
    return this.snackbar && this.snackbar.setState({ open: false })
  }

  render() {
    const { id, message = '', status = 'neutral', duration = 3000 } = this.props
    const colorByStatus = {
      success: colors.brandGreen,
      error: colors.severe,
      neutral: 'white',
    }

    return ReactDOM.createPortal(
      <Snackbar
        ref={(el) => { this.snackbar = el }}
        open={Boolean(message)}
        message={message}
        autoHideDuration={duration}
        contentStyle={{ color: colorByStatus[status], fontWeight: 'bold' }}
        onRequestClose={this.handleRequestClose}
      />,
      snackBarRoot,
    )
  }
}

SnackBar.propTypes = {
  id: PropTypes.number, // this prop ensures SnackBar re-renders even if message hasn't changed
  message: PropTypes.string,
  status: PropTypes.oneOf(['success', 'error', 'neutral']),
  duration: PropTypes.number,
}

const mapStateToProps = (state) => {
  const { id, message, status, duration } = state.snackbar
  return { id, message, status, duration }
}

export default connect(mapStateToProps, null)(SnackBar)
