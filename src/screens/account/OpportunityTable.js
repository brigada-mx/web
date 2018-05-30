/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

import ReactTable from 'react-table'
import Toggle from 'material-ui/Toggle'
import '!style-loader!css-loader!react-table/react-table.css'

import { tokenMatch } from 'tools/string'


const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined ? tokenMatch(String(row[id]), filter.value) : true
}

const OpportunityTable = ({ opportunities, onTogglePublished, onRowClicked }) => {
  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Puesto',
      accessor: 'position',
    },
    {
      Header: '¿Cuántos voluntarios?',
      accessor: 'target',
    },
    {
      Header: '¿Cúantos encontrados?',
      accessor: 'progress',
    },
  ]
  if (onTogglePublished) {
    columns.push({
      Header: '¿Publicar?',
      accessor: 'published',
      Cell: props => (<Toggle
        toggled={props.original.published}
        onToggle={(e, toggled) => onTogglePublished(props.original.id, toggled)}
      />),
    })
  }

  return (
    <ReactTable
      className="-highlight"
      pageSize={opportunities.length}
      showPagination={false}
      data={opportunities}
      columns={columns}
      defaultFilterMethod={defaultFilterMethod}
      getTdProps={(state, rowInfo, column) => {
        const { id } = column
        const handleRowClicked = (e, handleOriginal) => {
          if (id !== 'published' && rowInfo) {
            onRowClicked(rowInfo.original.id)
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

OpportunityTable.propTypes = {
  opportunities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRowClicked: PropTypes.func.isRequired,
  onTogglePublished: PropTypes.func,
}

export default OpportunityTable
