import React from 'react'
import PropTypes from 'prop-types'

import Select from 'react-select'


const MultiSelect = ({ value, multiLabel, ...rest }) => {
  const renderValue = (label, index) => {
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
    return <span className="multi-select-one">{label}</span>
  }

  return (
    <Select
      value={value}
      valueRenderer={({ label }, index) => renderValue(label, index)}
      {...rest}
    />
  )
}

MultiSelect.propTypes = {
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  multiLabel: PropTypes.string.isRequired,
}

export default MultiSelect
