import React from 'react'
import PropTypes from 'prop-types'

import Snackbar from 'material-ui/Snackbar'

import { connect } from 'react-redux'
import Colors from 'src/Colors'


const SnackBar = ({ id, message = '', status = 'neutral' }) => {
  const colorByStatus = {
    success: Colors.brandGreen,
    error: Colors.severe,
    neutral: 'white',
  }

  return (
    <Snackbar
      open={Boolean(message)}
      message={message}
      autoHideDuration={2500}
      contentStyle={{ color: colorByStatus[status], fontWeight: 'bold' }}
    />
  )
}

SnackBar.propTypes = {
  id: PropTypes.number, // this prop ensures SnackBar re-renders even if message hasn't changed
  message: PropTypes.string,
  status: PropTypes.oneOf(['success', 'error', 'neutral']),
}

const mapStateToProps = (state) => {
  const { id, message, status } = state.snackbar
  return { id, message, status }
}

export default connect(mapStateToProps, null)(SnackBar)
