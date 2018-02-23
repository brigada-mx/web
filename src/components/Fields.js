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

const TextInput = ({ input, meta, ...rest }) => {
  const { name, value, onChange, onBlur } = input
  const { touched, error } = meta
  return (
    <TextFieldMui
      onBlur={onBlur}
      name={name}
      value={value}
      onChange={onChange}
      errorText={touched && error}
      {...rest}
    />
  )
}

const TextField = fieldOf(TextInput)
export { TextField }
