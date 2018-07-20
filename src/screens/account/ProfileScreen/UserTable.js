/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import ReactTable from 'react-table'
import Toggle from 'material-ui/Toggle'
import '!style-loader!css-loader!react-table/react-table.css'


const UserTable = ({ users, onToggleMainuser, onToggleIsActive, me }) => {
  const columns = [
    {
      Header: 'Nombre',
      accessor: 'first_name',
    },
    {
      Header: 'Apellidos',
      accessor: 'surnames',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
  ]

  if (onToggleMainuser && me.is_mainuser && window.innerWidth >= 768) {
    columns.push({
      Header: '¿Administrador?',
      accessor: 'is_mainuser',
      Cell: props => (<Toggle
        toggled={props.original.is_mainuser}
        onToggle={(e, toggled) => onToggleMainuser(props.original.id, toggled)}
        disabled={me.id === props.original.id}
      />),
    })
  }
  if (onToggleIsActive && me.is_mainuser && window.innerWidth >= 768) {
    columns.push({
      Header: '¿Activo?',
      accessor: 'is_active',
      Cell: props => (<Toggle
        toggled={props.original.is_active}
        onToggle={(e, toggled) => onToggleIsActive(props.original.id, toggled)}
        disabled={me.id === props.original.id}
      />),
    })
  }

  return (
    <ReactTable
      className="-highlight"
      pageSize={users.length}
      showPagination={false}
      data={users}
      columns={columns}
      noDataText=""
    />
  )
}

UserTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  me: PropTypes.object.isRequired,
  onToggleMainuser: PropTypes.func,
  onToggleIsActive: PropTypes.func,
}

export default pure(UserTable)
