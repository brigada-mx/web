import React from 'react'

import { fieldPropTypes } from 'redux-form'
import PhotoGallery from './PhotoGallery'
import Styles from './PhotoGallery.css'


const PhotoGalleryPicker = ({ input, meta, ...rest }) => {
  const { value, onChange } = input
  const { error, submitFailed } = meta

  const handleClickItem = (e, { photo: item }) => {
    const { type, id, url, src, youtube_video_id } = item
    if (value && value.url && value.url === url) onChange({})
    else onChange({ type, id, url, src, youtube_video_id })
  }

  const gallery = <PhotoGallery {...rest} onClickItem={handleClickItem} selectedUrl={value && value.url} />
  if (submitFailed && error) {
    return <div className={Styles.error}><div className={Styles.errorText}>{error}</div>{gallery}</div>
  }
  return gallery
}

PhotoGalleryPicker.propTypes = {
  ...fieldPropTypes,
}

export default PhotoGalleryPicker
