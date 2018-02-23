/* eslint-disable react/prop-types */
import React from 'react'

import { Field } from 'redux-form'

import TextFieldMui from 'material-ui/TextField'


const fieldOf = (inputComponent) => {
  const WrappedField = (props) => {
    return (
      <Field component={inputComponent} {...props} />
    )
  }
  return WrappedField
}

const TextInput = ({ input: { name, value, onChange }, ...rest }) => {
  return (
    <TextFieldMui
      name={name}
      value={value}
      onChange={onChange}
      {...rest}
    />
  )
}

const TextField = fieldOf(TextInput)
export { TextField }
