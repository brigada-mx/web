/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import moment from 'moment'
import ReactTable from 'react-table'
import Toggle from 'material-ui/Toggle'
import '!style-loader!css-loader!react-table/react-table.css'

import Styles from './TestimonialTable.css'


const TestimonialTable = ({
  testimonials,
  onTogglePublished,
  onPreview,
  onRowClicked,
}) => {
  const columns = [
    {
      Header: 'Vídeo',
      id: 'preview',
      Cell: (props) => {
        const { video } = props.original
        return (
          <div className={Styles.thumbnailContainer}>
            {!video.youtube_video_id && <span>En proceso...</span>}
            {video.youtube_video_id &&
              <div
                key={video.url_thumbnail}
                className={Styles.thumbnail}
                style={{
                  backgroundImage: `url("${video.url_thumbnail}")`,
                }}
                onClick={() => { onPreview(video.youtube_video_id) }}
              />
            }
          </div>
        )
      },
    },
    {
      Header: 'Descripción',
      accessor: 'desc',
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

  const maxPageSize = 10

  return (
    <ReactTable
      className="-highlight"
      pageSize={Math.min(testimonials.length, maxPageSize)}
      showPagination={testimonials.length > maxPageSize}
      data={testimonials}
      columns={columns}
      getTdProps={(state, rowInfo, column) => {
        const { id } = column
        return {
          onClick: (e, handleOriginal) => {
            if (id !== 'preview' && id !== 'published' && rowInfo && onRowClicked) onRowClicked(rowInfo.original.id)
            if (handleOriginal) handleOriginal()
          },
          style: id !== 'preview' && id !== 'published' && onRowClicked ? { cursor: 'pointer' } : {},
        }
      }}
    />
  )
}

TestimonialTable.propTypes = {
  testimonials: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTogglePublished: PropTypes.func,
  onRowClicked: PropTypes.func,
  onPreview: PropTypes.func,
}

export default pure(TestimonialTable)
