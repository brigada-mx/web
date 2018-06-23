import React from 'react'
import PropTypes from 'prop-types'

import Select from 'react-select'


const MultiSelect = ({ value, multiLabel, options, ...rest }) => {
  const renderValue = (v, index) => {
    if (index > 0) return null
    if (value.length > 1) {
      return (
        <div className="multi-select-many">
          <span>{multiLabel}</span>
          <span className="multi-select-divider">·</span>
          <span>{value.length}</span>
        </div>
      )
    }
    const option = options.find(o => o.value === v) || { label: '?' }
    return <span className="multi-select-one">{option.label}</span>
  }

  return (
    <Select
      value={value}
      valueRenderer={({ value: v }, index) => renderValue(v, index)}
      options={options}
      {...rest}
    />
  )
}

MultiSelect.propTypes = {
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  multiLabel: PropTypes.string.isRequired,
}

export default MultiSelect
