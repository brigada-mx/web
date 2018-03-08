/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import ReactTable from 'react-table'
import Checkbox from 'material-ui/Checkbox'
import '!style-loader!css-loader!react-table/react-table.css'

import { tokenMatch, thumborUrl } from 'tools/string'
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
    },
    {
      Header: 'Descripción',
      accessor: 'description',
    },
    {
      Header: 'Creada',
      accessor: 'submitted',
      Cell: props => <span>{moment(props.original.submitted).format('h:mma, DD MMMM YYYY')}</span>,
    },
    {
      Header: 'Fotos',
      Cell: (props) => {
        const thumbs = (props.original.image_urls || []).map((url) => {
          return (
            <div
              key={url}
              className={Styles.thumbnail}
              style={{ backgroundImage: `url(${thumborUrl(url, 120, 120, true)})` }}
            />
          )
        })
        return <div className={Styles.thumbnailContainer}>{thumbs}</div>
      },
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
      getTdProps={(state, rowInfo, column) => {
        const { id } = column
        return {
          onClick: (e, handleOriginal) => {
            if (id !== 'published' && rowInfo && onRowClicked) onRowClicked(rowInfo.original.id)
            if (handleOriginal) handleOriginal()
          },
          style: id !== 'published' && onRowClicked ? { cursor: 'pointer' } : {},
        }
      }}
    />
  )
}

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTogglePublished: PropTypes.func.isRequired,
  onRowClicked: PropTypes.func,
}

export default SubmissionTable
