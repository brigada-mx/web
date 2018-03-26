/* eslint-disable react/prop-types */
import React from 'react'

import { Field } from 'redux-form'
import {
  TextField as TextInput,
  SelectField as SelectInput,
  Checkbox as CheckboxInput,
  DatePicker as DatePickerInput,
  AutoComplete as AutoCompleteInput,
  Toggle as ToggleInput,
  RadioButtonGroup as RadioButtonGroupInput,
} from 'redux-form-material-ui'

import Styles from 'src/Form.css'


const fieldOf = (inputComponent) => {
  const WrappedField = (props) => {
    return <Field className={Styles.field} component={inputComponent} {...props} />
  }
  return WrappedField
}

const TextField = fieldOf(TextInput)
const SelectField = fieldOf(SelectInput)
const Checkbox = fieldOf(CheckboxInput)
const Toggle = fieldOf(ToggleInput)
const DatePicker = fieldOf(DatePickerInput)
const AutoComplete = fieldOf(AutoCompleteInput)
const RadioButtonGroup = fieldOf(RadioButtonGroupInput)
export { TextField, SelectField, Checkbox, Toggle, DatePicker, AutoComplete, RadioButtonGroup }
