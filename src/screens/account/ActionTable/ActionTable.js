/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

import ReactTable from 'react-table'
import Toggle from 'material-ui/Toggle'
import RaisedButton from 'material-ui/RaisedButton'
import { withRouter } from 'react-router-dom'
import '!style-loader!css-loader!react-table/react-table.css'

import { tokenMatch } from 'tools/string'
import { projectTypeByValue } from 'src/choices'
import FormStyles from 'src/Form.css'
import Styles from './ActionTable.css'


const pageSizeOptions = [5, 10, 20, 50]
const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined ? tokenMatch(String(row[id]), filter.value) : true
}

const ActionTable = ({ actions, onTogglePublished, onRestore, history }) => {
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
  ]
  if (onTogglePublished) {
    columns.push({
      Header: '¿Publicar?',
      accessor: 'published',
      Cell: props => (<Toggle
        toggled={props.original.published}
        onToggle={(e, toggled) => onTogglePublished(props.original.id, props.original.key, toggled)}
      />),
    })
  }
  if (onRestore) {
    columns.push({
      Header: '¿Restaurar?',
      Cell: props => (<RaisedButton
        className={FormStyles.button}
        label="RESTAURAR"
        onClick={() => onRestore(props.original.id, props.original.key)}
      />),
    })
  }

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
        const handleRowClicked = onRestore ? undefined : (e, handleOriginal) => {
          if (id !== 'published' && rowInfo) {
            history.push(`/cuenta/proyectos/${rowInfo.original.key}`)
          }
          if (handleOriginal) handleOriginal()
        }
        return {
          onClick: handleRowClicked,
          style: id !== 'published' ? { cursor: 'pointer' } : {},
        }
      }}
    />
  )
}

ActionTable.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTogglePublished: PropTypes.func,
  onRestore: PropTypes.func,
  history: PropTypes.object.isRequired,
}

export default withRouter(ActionTable)
