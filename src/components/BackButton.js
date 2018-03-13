import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'


const BackButton = ({ to }) => {
  return (
    <RaisedButton
      containerElement={<Link to={to} />}
      label="REGRESAR"
      icon={<BackIcon />}
    />
  )
}

BackButton.propTypes = {
  to: PropTypes.string.isRequired,
}

export default BackButton
