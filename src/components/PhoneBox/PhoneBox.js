import React from 'react'
import PropTypes from 'prop-types'

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
    this.setState({ focused: !this.state.focused })
  }

  render() {
    const { phone } = this.props
    const { focused } = this.state

    if (window.innerWidth >= 768) {
      return (
        <div
          onClick={this.toggle}
          className={Styles.box}
        >
          {focused && <span className={Styles.tooltip}>{phone}</span>}
        </div>
      )
    }
    return (
      <a
        target="_blank"
        className={`${Styles.box} ${Styles.phone}`}
        href={phoneLink(phone)}
      />
    )
  }
}

PhoneBox.propTypes = {
  phone: PropTypes.string.isRequired,
}

export default PhoneBox
