/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

import ReactTable from 'react-table'
import Toggle from 'material-ui/Toggle'
import { withRouter } from 'react-router-dom'
import '!style-loader!css-loader!react-table/react-table.css'

import { tokenMatch } from 'tools/string'
import { projectTypeByValue } from 'src/choices'
import Styles from './ActionTable.css'


const pageSizeOptions = [5, 10, 20, 50]
const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined ? tokenMatch(String(row[id]), filter.value) : true
}

const ActionTable = ({ actions, onTogglePublished, history }) => {
  const columns = [
    {
      Header: 'Clave',
      accessor: 'key',
    },
    {
      Header: 'Localidad',
      accessor: 'locality.name',
    },
    {
      Header: 'Tipo',
      accessor: 'action_type',
      Cell: props => projectTypeByValue[props.original.action_type] || props.original.action_type,
    },
    {
      Header: 'Meta',
      accessor: 'target',
    },
    {
      Header: 'Unidad',
      accessor: 'unit_of_measurement',
    },
    {
      Header: 'Presupuesto',
      accessor: 'budget',
    },
    {
      Header: 'Inicio',
      accessor: 'start_date',
    },
    {
      Header: '¿Publicar?',
      accessor: 'published',
      Cell: props => (<Toggle
        toggled={props.original.published}
        onToggle={(e, toggled) => onTogglePublished(props.original.id, props.original.key, toggled)}
      />),
    },
  ]

  let pageSize = 5
  if (actions.length > 5) pageSize = 10
  if (actions.length > 10) pageSize = 20

  return (
    <ReactTable
      className="-highlight"
      pageSizeOptions={pageSizeOptions}
      defaultPageSize={pageSize}
      data={actions}
      columns={columns}
      defaultFilterMethod={defaultFilterMethod}
      getTdProps={(state, rowInfo, column) => {
        const { id } = column
        return {
          onClick: (e, handleOriginal) => {
            if (id !== 'published' && rowInfo) {
              history.push(`/cuenta/proyectos/${rowInfo.original.key}`)
            }
            if (handleOriginal) handleOriginal()
          },
          style: id !== 'published' ? { cursor: 'pointer' } : {},
        }
      }}
    />
  )
}

ActionTable.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTogglePublished: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(ActionTable)
