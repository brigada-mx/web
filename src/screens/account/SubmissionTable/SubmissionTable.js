/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import ReactTable from 'react-table'
import Checkbox from 'material-ui/Checkbox'
import '!style-loader!css-loader!react-table/react-table.css'

import { tokenMatch } from 'tools/string'
import Styles from './SubmissionTable.css'


const pageSizeOptions = [5, 10, 20, 50]
const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined ? tokenMatch(String(row[id]), filter.value) : true
}

const SubmissionTable = ({ submissions, onTogglePublished, onRowClicked }) => {
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
      Cell: props => <span>{moment(props.original.submitted).format('h:mma, DD MMMM YYYY')}</span>,
      filterable: false,
    },
    {
      Header: 'Fotos',
      Cell: (props) => {
        const thumbs = (props.original.thumbnails_small || []).map((thumb) => {
          return (
            <div
              key={thumb}
              className={Styles.thumbnail}
              style={{ backgroundImage: `url(${thumb})` }}
            />
          )
        })
        return <div className={Styles.thumbnailContainer}>{thumbs}</div>
      },
      filterable: false,
    },
  ]

  let pageSize = 5
  if (submissions.length > 5) pageSize = 10
  if (submissions.length > 10) pageSize = 20

  return (
    <ReactTable
      className="-highlight"
      pageSizeOptions={pageSizeOptions}
      defaultPageSize={pageSize}
      data={submissions}
      columns={columns}
      defaultFilterMethod={defaultFilterMethod}
      filterable
      getTdProps={(state, rowInfo, column) => {
        const { id } = column
        return {
          onClick: (e, handleOriginal) => {
            if (id !== 'published') onRowClicked(rowInfo.original.id)
            if (handleOriginal) handleOriginal()
          },
          style: id !== 'published' ? { cursor: 'pointer' } : {},
        }
      }}
    />
  )
}

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTogglePublished: PropTypes.func.isRequired,
  onRowClicked: PropTypes.func.isRequired,
}

export default SubmissionTable
