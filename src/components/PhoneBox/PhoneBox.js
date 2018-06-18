import React from 'react'
import PropTypes from 'prop-types'

import { fireGaEvent } from 'tools/other'
import { phoneLink, getTextWidth } from 'tools/string'
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
    const text = name && name.length > phone.length ? name : phone
    const textWidth = getTextWidth(text, 'roboto-700 13px')
    const { focused } = this.state

    if (window.innerWidth >= 768) {
      return (
        <div
          onClick={this.toggle}
          className={Styles.box}
        >
          {focused &&
            <div style={{ left: -0.5 * textWidth + 12.5 }} className={Styles.tooltip}>
              {name && <span className={Styles.name}>{name}</span>}
              <span className={Styles.phone}>{phone}</span>
            </div>
          }
        </div>
      )
    }
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
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
