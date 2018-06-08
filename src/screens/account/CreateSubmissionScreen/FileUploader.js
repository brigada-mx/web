/* eslint-disable no-param-reassign */
import React from 'react'
import PropTypes from 'prop-types'

import service from 'api/service'
import Styles from './FileUploader.css'


const maxSizeBytes = 10 * 1000 * 1000

class FileUploader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
    this._files = []
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

  handleFiles = (files) => {
    files.forEach(this.handleFile)
  }

  handleFile = (file) => {
    const { name, size, type } = file
    const fileWithMeta = { file, meta: { name, size, type, status: 'uploading', percent: 0 } }
    this._files.push(fileWithMeta)
    if (!type.startsWith('image/') || size > maxSizeBytes) return
    this.previewFile(fileWithMeta)
    this.uploadFile(fileWithMeta)
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
    const { file, meta: { name, size } } = fileWithMeta
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
      if (xhr.readyState === 4 && xhr.status < 400) {
        fileWithMeta.meta.percent = 100
        fileWithMeta.meta.status = 'done'
        this.forceUpdate()
      } else if (xhr.readyState === 4 && xhr.status >= 400) {
        fileWithMeta.meta.status = 'error_upload'
        this.forceUpdate()
      }
    })

    for (const field of Object.keys(fields)) {
      formData.append(field, fields[field])
    }
    formData.append('file', file)
    xhr.send(formData)
  }

  render() {
    const { active } = this.state
    console.log(this._files)
    if (this._files.length) {
      console.log(this._files[0].meta.percent)
      console.log(this._files[0].meta.status)
    }

    return (
      <div
        className={`${Styles.dropzone} ${active ? Styles.active : Styles.inactive}`}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        Arrastra imágenes aquí, o dale clic al botón.
      </div>
    )
  }
}

FileUploader.propTypes = {
}

export default FileUploader
