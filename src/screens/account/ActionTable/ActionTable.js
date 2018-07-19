/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import ReactTable from 'react-table'
import Toggle from 'material-ui/Toggle'
import RaisedButton from 'material-ui/RaisedButton'
import { withRouter } from 'react-router-dom'
import '!style-loader!css-loader!react-table/react-table.css'

import { tokenMatch } from 'tools/string'
import { projectTypeByValue } from 'src/choices'
import Preview from 'components/Preview'
import FormStyles from 'src/Form.css'
import Styles from './ActionTable.css'


const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined ? tokenMatch(String(row[id]), filter.value) : true
}

const ActionTable = ({ actions, onTogglePublished, onRestore, history, onClickImage }) => {
  const columns = [
    {
      Header: 'Clave',
      accessor: 'key',
      maxWidth: 60,
    },
    {
      Header: 'Tipo',
      accessor: 'action_type',
      Cell: props => projectTypeByValue[props.original.action_type] || props.original.action_type,
    },
    {
      Header: '¿Transparente?',
      accessor: 'level',
      maxWidth: 120,
      Cell: (props) => {
        const src = props.original.level >= 2 ? '/assets/img/circle-checkmark-accent.svg' : '/assets/img/circle-checkmark.svg'
        return (
          <img
            className={Styles.checkmark}
            src={src}
            alt="Proyecto transparente"
            height={25}
          />
        )
      },
    },
  ]
  if (window.innerWidth >= 980) {
    columns.splice(2, 0, {
      Header: 'Inicio',
      accessor: 'start_date',
      maxWidth: 130,
    })
    columns.splice(2, 0, {
      Header: 'Presupuesto',
      accessor: 'budget',
      maxWidth: 140,
    })
    columns.splice(2, 0, {
      Header: 'Localidad',
      accessor: 'locality.name',
    })
  }

  if (onClickImage && window.innerWidth >= 980) {
    columns.unshift({
      Header: 'Imagen',
      accessor: 'preview',
      maxWidth: 120,
      Cell: (props) => {
        const { preview, id } = props.original
        return <Preview {...preview} onClick={() => onClickImage(id)} width="100%" height={96} style={{ backgroundSize: 'auto' }} />
      },
    })
  }
  if (onTogglePublished && window.innerWidth >= 980) {
    columns.push({
      Header: '¿Publicar?',
      accessor: 'published',
      maxWidth: 120,
      Cell: props => (<Toggle
        toggled={props.original.published}
        onToggle={(e, toggled) => onTogglePublished(props.original.id, props.original.key, toggled)}
      />),
    })
  }
  if (onRestore && window.innerWidth >= 980) {
    columns.push({
      Header: '¿Restaurar?',
      maxWidth: 120,
      Cell: props => (<RaisedButton
        className={FormStyles.button}
        label="RESTAURAR"
        onClick={() => onRestore(props.original.id, props.original.key)}
      />),
    })
  }

  return (
    <ReactTable
      className="-highlight"
      pageSize={actions.length}
      showPagination={false}
      data={actions}
      columns={columns}
      noDataText=""
      defaultFilterMethod={defaultFilterMethod}
      getTdProps={(state, rowInfo, column) => {
        const { id } = column
        const handleRowClicked = onRestore ? undefined : (e, handleOriginal) => {
          if (id !== 'published' && id !== 'preview' && rowInfo) {
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
  onClickImage: PropTypes.func,
}

export default withRouter(pure(ActionTable))
