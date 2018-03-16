import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import LiveChatLoader from './LiveChatLoader'


const LiveChat = ({ open }) => {
  if (!open) return null
  return (
    <LiveChatLoader license={9592725} />
  )
}

LiveChat.propTypes = {
  open: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => {
  const { open = false } = state.livechat
  return { open }
}

export default connect(mapStateToProps, null)(LiveChat)
