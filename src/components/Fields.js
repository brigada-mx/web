import React from 'react'
import PropTypes from 'prop-types'

import TextFieldMui from 'material-ui/TextField'


export const TextField = ({ hintText, input: { name, value, onChange } }) => {
  return (
    <TextFieldMui
      name={name}
      value={value}
      hintText={hintText}
      onChange={onChange}
    />
  )
}
