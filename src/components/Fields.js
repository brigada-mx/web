/* eslint-disable react/prop-types */
import React from 'react'

import { Field } from 'redux-form'
import {
  TextField as TextInput,
  SelectField as SelectInput,
  Checkbox as CheckboxInput,
  DatePicker as DatePickerInput,
  AutoComplete as AutoCompleteInput,
} from 'redux-form-material-ui'


const fieldOf = (inputComponent) => {
  const WrappedField = (props) => {
    return (
      <Field component={inputComponent} {...props} />
    )
  }
  return WrappedField
}

const TextField = fieldOf(TextInput)
const SelectField = fieldOf(SelectInput)
const Checkbox = fieldOf(CheckboxInput)
const DatePicker = fieldOf(DatePickerInput)
const AutoComplete = fieldOf(AutoCompleteInput)
export { TextField, SelectField, Checkbox, DatePicker, AutoComplete }
