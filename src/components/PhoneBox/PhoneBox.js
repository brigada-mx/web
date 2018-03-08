import React from 'react'
import PropTypes from 'prop-types'

import { fireGaEvent } from 'tools/other'
import { phoneLink } from 'tools/string'
import Styles from './PhoneBox.css'


class PhoneBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: false,
    }
  }

  toggle = () => {
    if (this.state.focused === false) fireGaEvent('phone')
    this.setState({ focused: !this.state.focused })
  }

  render() {
    const { phone, name } = this.props
    const { focused } = this.state

    const text = name ? `${phone} : ${name}` : phone
    if (window.innerWidth >= 768) {
      return (
        <div
          onClick={this.toggle}
          className={Styles.box}
        >
          {focused && <span className={Styles.tooltip}>{text}</span>}
        </div>
      )
    }
    return (
      <a
        target="_blank"
        className={`${Styles.box} ${Styles.phone}`}
        href={phoneLink(phone)}
        onClick={() => fireGaEvent('phone')}
      />
    )
  }
}

PhoneBox.propTypes = {
  phone: PropTypes.string.isRequired,
  name: PropTypes.string,
}

export default PhoneBox
