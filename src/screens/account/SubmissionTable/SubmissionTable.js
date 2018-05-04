/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import ReactTable from 'react-table'
import Toggle from 'material-ui/Toggle'
import RaisedButton from 'material-ui/RaisedButton'
import '!style-loader!css-loader!react-table/react-table.css'

import ConfirmButton from 'components/ConfirmButton'
import { tokenMatch, thumborUrl, imageStyleObject } from 'tools/string'
import FormStyles from 'src/Form.css'
import SubmissionActionSelect from './SubmissionActionSelect'
import Styles from './SubmissionTable.css'


const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined ? tokenMatch(String(row[id]), filter.value) : true
}

const SubmissionTable = ({
  submissions,
  onChangeAction,
  onTogglePublished,
  onRestore,
  onRowClicked,
  onDelete,
}) => {
  const columns = [
    {
      Header: 'Fotos',
      Cell: (props) => {
        const thumbs = (props.original.images || []).map((image) => {
          return (
            <div
              key={image.url}
              className={Styles.thumbnail}
              style={{
                backgroundImage: `url("${thumborUrl(image, 120, 120, { crop: true, rotate: false })}")`,
                ...imageStyleObject(image),
              }}
            />
          )
        })
        return <div className={Styles.thumbnailContainer}>{thumbs}</div>
      },
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
  if (onRestore) {
    columns.push({
      Header: '¿Restaurar?',
      Cell: props => (<RaisedButton
        className={FormStyles.button}
        label="RESTAURAR"
        onClick={() => onRestore(props.original.id)}
      />),
    })
  }
  if (onDelete) {
    columns.push({
      Header: '¿Borrar?',
      Cell: props => (<ConfirmButton
        className={FormStyles.button}
        text="Borrar"
        onConfirm={() => onDelete(props.original.id)}
      />),
    })
  }

  if (onChangeAction) {
    columns.splice(3, 0, {
      Header: 'Proyecto',
      accessor: 'action_id',
      Cell: props => (<SubmissionActionSelect
        value={props.original.action_id}
        onChange={(event, key, payload) => onChangeAction(props.original.id, payload)}
        getterKey="accountActions"
      />),
    })
  }

  const maxPageSize = 20

  return (
    <ReactTable
      className="-highlight"
      pageSize={Math.min(submissions.length, maxPageSize)}
      showPagination={submissions.length > maxPageSize}
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
  onTogglePublished: PropTypes.func,
  onChangeAction: PropTypes.func,
  onRowClicked: PropTypes.func,
  onDelete: PropTypes.func,
}

export default SubmissionTable
