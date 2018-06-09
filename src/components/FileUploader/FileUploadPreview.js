import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import { formatBytes } from 'tools/string'
import Styles from './FileUploader.css'


const FileUploadPreview = ({ name = '', percent = 0, size = 0, previewUrl, type, status, onCancel }) => {
  const title = `${name || '?'}, ${formatBytes(size)}`

  return (
    <div className={Styles.previewContainer}>
      <img className={Styles.preview} src={previewUrl} alt={title} title={title} />
      <progress max={100} value={percent} />
      {status === 'uploading' && <span className={Styles.abortButton} onClick={onCancel} />}
    </div>
  )
}

FileUploadPreview.propTypes = {
  name: PropTypes.string,
  percent: PropTypes.number,
  size: PropTypes.number,
  previewUrl: PropTypes.string,
  type: PropTypes.string.isRequired,
  status: PropTypes.oneOf(
    ['uploading', 'error_file_size', 'error_upload_url', 'aborted', 'done', 'error_upload']
  ).isRequired,
  onCancel: PropTypes.func,
}

export default pure(FileUploadPreview)