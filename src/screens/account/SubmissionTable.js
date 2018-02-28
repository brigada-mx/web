/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

import ReactTable from 'react-table'
import Checkbox from 'material-ui/Checkbox'
import '!style-loader!css-loader!react-table/react-table.css'

import { tokenMatch } from 'tools/string'


const pageSizeOptions = [5, 10, 20, 50]
const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined ? tokenMatch(String(row[id]), filter.value) : true
}

const SubmissionTable = ({ submissions, onTogglePublished, history }) => {
  const columns = [
    {
      Header: 'Publicada',
      accessor: 'published',
      Cell: props => (<Checkbox
        checked={props.original.published}
        onCheck={(e, checked) => onTogglePublished(props.original.id, checked)}
      />),
      filterable: false,
    },
    {
      Header: 'Descripción',
      accessor: 'description',
    },
    {
      Header: 'Dirección',
      accessor: 'address',
    },
    {
      Header: 'Creada',
      accessor: 'submitted',
      filterable: false,
    },
  ]

  let pageSize = 5
  if (submissions.length > 5) pageSize = 10
  if (submissions.length > 10) pageSize = 20

  return (
    <ReactTable
      pageSizeOptions={pageSizeOptions}
      defaultPageSize={pageSize}
      data={submissions}
      columns={columns}
      defaultFilterMethod={defaultFilterMethod}
      filterable
      getTdProps={(state, rowInfo, column) => {
        return {
          onClick: (e, handleOriginal) => {
            const { id } = column
            if (id !== 'published' && id !== 'locality.name') {
              history.push(`/cuenta/proyectos/${rowInfo.original.key}`)
            }
            if (handleOriginal) handleOriginal()
          },
        }
      }}
    />
  )
}

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTogglePublished: PropTypes.func.isRequired,
}

export default SubmissionTable
