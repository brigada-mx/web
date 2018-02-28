/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

import ReactTable from 'react-table'
import Checkbox from 'material-ui/Checkbox'
import { Link, withRouter } from 'react-router-dom'
import '!style-loader!css-loader!react-table/react-table.css'

import { projectTypeByValue } from 'src/choices'
import Styles from './ActionTable.css'


const ActionTable = ({ actions, onTogglePublished, history }) => {
  const columns = [
    {
      Header: 'Publicado',
      accessor: 'published',
      Cell: props => (<Checkbox
        checked={props.original.published}
        onCheck={(e, checked) => onTogglePublished(props.original.id, checked)}
      />),
    },
    {
      Header: 'Localidad',
      accessor: 'locality.name',
      Cell: (props) => {
        const { id, name } = props.original.locality
        return <Link className={Styles.link} to={{ pathname: `/comunidades/${id}` }}>{name}</Link>
      },
    },
    {
      Header: 'Tipo',
      accessor: 'action_type',
      Cell: props => projectTypeByValue[props.original.action_type] || props.original.action_type,
    },
    {
      Header: 'Descripción',
      accessor: 'desc',
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
      Header: 'Inicio',
      accessor: 'start_date',
    },
  ]

  return (
    <ReactTable
      data={actions}
      columns={columns}
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

ActionTable.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTogglePublished: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(ActionTable)
