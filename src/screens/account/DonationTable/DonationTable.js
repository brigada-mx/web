/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import ReactTable from 'react-table'
import Checkbox from 'material-ui/Checkbox'
import Toggle from 'material-ui/Toggle'
import { Link } from 'react-router-dom'
import '!style-loader!css-loader!react-table/react-table.css'

import { tokenMatch } from 'tools/string'
import Styles from './DonationTable.css'


const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined ? tokenMatch(String(row[id]), filter.value) : true
}

const DonationTable = ({ donations, onToggleApproved, onRowClicked }) => {
  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Org',
      accessor: 'donor.id',
      Cell: (props) => {
        const { id, name } = props.original.donor
        return <Link className={Styles.link} to={`/donadores/${id}`}>{name}</Link>
      },
    },
    {
      Header: 'Monto MXN',
      accessor: 'amount',
    },
    {
      Header: 'Fecha recibida',
      accessor: 'received_date',
    },
    {
      Header: '¿Aprobada por donador?',
      accessor: 'approved_by_donor',
      Cell: props => (<Checkbox
        disabled
        checked={props.original.approved_by_donor}
        labelPosition="left"
      />),
    },
  ]
  if (onToggleApproved) {
    columns.push({
      Header: '¿Aprobar?',
      accessor: 'approved_by_org',
      Cell: props => (<Toggle
        toggled={props.original.approved_by_org}
        onToggle={(e, toggled) => onToggleApproved(props.original.id, toggled)}
      />),
    })
  }

  return (
    <ReactTable
      className="-highlight"
      pageSize={donations.length}
      showPagination={false}
      data={donations}
      columns={columns}
      defaultFilterMethod={defaultFilterMethod}
      getTdProps={(state, rowInfo, column) => {
        const { id } = column
        const handleRowClicked = (e, handleOriginal) => {
          if (id !== 'approved_by_org' && id !== 'donor.id' && rowInfo) {
            onRowClicked(rowInfo.original.id)
          }
          if (handleOriginal) handleOriginal()
        }
        return {
          onClick: handleRowClicked,
          style: !['approved_by_org', 'donor.id'].includes(id) ? { cursor: 'pointer' } : {},
        }
      }}
    />
  )
}

DonationTable.propTypes = {
  donations: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRowClicked: PropTypes.func.isRequired,
  onToggleApproved: PropTypes.func,
}

export default pure(DonationTable)
