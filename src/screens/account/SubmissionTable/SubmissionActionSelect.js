import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'

import { projectTypeByValue } from 'src/choices'


const SubmissionActionSelect = ({ actions, onChange, value }) => {
  const items = actions.map((a) => {
    const { id, key, action_type: type, desc } = a
    return { label: `${key} — ${projectTypeByValue[type] || '?'} — ${desc}`, value: id }
  })

  return (
    <SelectField
      value={value}
      onChange={onChange}
    >
      {items.map(({ value, label }) => {
        return <MenuItem key={value} value={value} primaryText={label} />
      })}
    </SelectField>
  )
}

SubmissionActionSelect.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
  getterKey: PropTypes.string,
}

const mapStateToProps = (state, { getterKey = 'accountActionsMinimal' }) => {
  try {
    const actions = state.getter[getterKey].data.results.sort((a, b) => {
      if (a.key < b.key) return 1
      if (a.key > b.key) return -1
      return 0
    })
    return { actions }
  } catch (e) {
    return { actions: [] }
  }
}

export default connect(mapStateToProps, null)(SubmissionActionSelect)
