import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'


const BackButton = ({ to }) => {
  return (
    <FlatButton
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
