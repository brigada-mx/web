/* eslint-disable no-param-reassign */
import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import RaisedButton from 'material-ui/RaisedButton'

import service from 'api/service'
import FormStyles from 'src/Form.css'
import FileUploadPreview from './FileUploadPreview'
import Styles from './FileUploader.css'


let id = 0
const maxSizeBytes = 10 * 1024 * 1024
const maxFiles = 8

class FileUploader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
    this._files = []
    this.dropzone = React.createRef()
  }

  handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ active: true })
  }

  handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ active: true })
  }

  handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ active: false })
  }

  handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ active: false })

    const { dataTransfer: { files } } = e
    const _files = [...files]
    this.handleFiles(_files)
  }

  // expects an array of File objects
  handleFiles = (files) => {
    files.forEach(this.handleFile)
  }

  handleFile = (file) => {
    const { name, size, type } = file
    if (!type.startsWith('image/')) return
    if (this._files.length >= maxFiles) return

    const fileWithMeta = { file, meta: { name, size, type, status: 'uploading', percent: 0, id } }
    this._files.push(fileWithMeta)
    id += 1

    if (size > maxSizeBytes) {
      fileWithMeta.meta.status = 'error_file_size'
      return
    }
    this.previewFile(fileWithMeta)
    this.uploadFile(fileWithMeta)
    this.forceUpdate()
    setTimeout(this.scrollToBottom, 500)
  }

  scrollToBottom = () => {
    this.dropzone.current.scrollTop = this.dropzone.current.scrollHeight
  }

  previewFile = (fileWithMeta) => {
    const reader = new FileReader()
    reader.readAsDataURL(fileWithMeta.file)
    reader.onloadend = () => {
      fileWithMeta.meta.previewUrl = reader.result
      this.forceUpdate()
    }
  }

  uploadFile = async (fileWithMeta) => {
    const { file, meta: { name } } = fileWithMeta
    const { data } = await service.getUploadUrl(name)
    if (!data) {
      fileWithMeta.meta.status = 'error_upload_url'
      this.forceUpdate()
      return
    }

    const { fields, url, full_url: fullUrl } = data
    fileWithMeta.meta.url = fullUrl

    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    // update progress (can be used to show progress indicator)
    xhr.upload.addEventListener('progress', (e) => {
      fileWithMeta.meta.percent = (e.loaded * 100.0 / e.total) || 100
      this.forceUpdate()
    })

    xhr.addEventListener('readystatechange', (e) => {
      if (xhr.readyState !== 4) return // `readyState` of 4 corresponds to `XMLHttpRequest.DONE`
      if (xhr.status === 0) {
        fileWithMeta.meta.status = 'aborted'
        this.forceUpdate()
      } else if (xhr.status < 400) {
        fileWithMeta.meta.percent = 100
        fileWithMeta.meta.status = 'done'
        this.forceUpdate()
      } else {
        fileWithMeta.meta.status = 'error_upload'
        this.forceUpdate()
      }
    })

    for (const field of Object.keys(fields)) {
      formData.append(field, fields[field])
    }
    formData.append('file', file)
    xhr.send(formData)
    fileWithMeta.xhr = xhr
  }

  handleSubmit = () => {
    this.props.onSubmit(
      this._files.map(f => f.meta).filter(f => f.status === 'done')
    )
  }

  handleCancel = (_id) => {
    const index = _.findIndex(this._files, f => f.meta.id === _id)
    if (index !== -1) this._files[index].xhr.abort()
  }

  handleRemove = (_id) => {
    const index = _.findIndex(this._files, f => f.meta.id === _id)
    if (index !== -1) {
      this._files.splice(index, 1)
      this.forceUpdate()
    }
  }

  render() {
    const { disabled = false, instructions } = this.props
    const { active } = this.state

    const chooseFiles = (add = false) => {
      return (
        <React.Fragment>
          <label
            htmlFor="fileUploaderInputId"
            className={Styles.inputLabel}
          >
            {add ? 'Agregar' : 'Escoger archivos'}
          </label>
          <input
            id="fileUploaderInputId"
            className={Styles.input}
            type="file"
            multiple
            accept="image/*"
            onChange={e => this.handleFiles(Array.from(e.target.files))}
          />
        </React.Fragment>
      )
    }

    const files = this._files.map((f) => {
      return (
        <FileUploadPreview
          key={f.meta.id}
          {...f.meta}
          onCancel={() => this.handleCancel(f.meta.id)}
          onRemove={() => this.handleRemove(f.meta.id)}
        />
      )
    })

    return (
      <React.Fragment>
        <div
          className={`${Styles.dropzone} ${active ? Styles.active : Styles.inactive}`}
          onDragEnter={this.handleDragEnter}
          onDragOver={this.handleDragOver}
          onDragLeave={this.handleDragLeave}
          onDrop={this.handleDrop}
          ref={this.dropzone}
        >
          {this._files.length === 0 &&
            <div className={Styles.dropzoneContent}>
              <span className={Styles.largeText}>{instructions || `Arrastra hasta ${maxFiles} imágenes`}</span>
              <span className={Styles.smallText}>- o puedes -</span>
              {chooseFiles(false)}
            </div>
          }

          {this._files.length > 0 &&
            <div className={Styles.previewListContainer}>
              {files}
              {this._files.length > 0 && this._files.length < maxFiles &&
                <div className={Styles.addFiles}>{chooseFiles(true)}</div>
              }
            </div>
          }

        </div>

        {this._files.length > 0 &&
          <div className={Styles.buttonContainer}>
            <RaisedButton
              backgroundColor="#3DC59F"
              labelColor="#ffffff"
              className={FormStyles.primaryButton}
              label="SUBIR"
              onClick={this.handleSubmit}
              disabled={disabled
                || this._files.some(f => f.meta.status === 'uploading')
                || !this._files.some(f => f.meta.status === 'done')
              }
            />
          </div>
        }
      </React.Fragment>
    )
  }
}

FileUploader.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  instructions: PropTypes.string,
}

export default FileUploader
