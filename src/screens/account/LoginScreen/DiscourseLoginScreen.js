import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import { parseQs } from 'tools/string'
import service from 'api/service'
import LoginForm from './LoginForm'


class DiscourseLoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'org',
    }
  }

  handleSubmit = async ({ email, password }) => {
    const { type } = this.state

    const params = parseQs(window.location.search)
    const fGetTokenByType = { org: service.token, donor: service.donorToken }
    const { data } = await fGetTokenByType[type](email, password)
    if (data) {
      window.location.replace('https://foro.brigada.mx/session/sso_login?sso=PAYLOAD&sig=SIG')
    } else {
      this.props.snackbar('No reconocemos este email/contraseña', 'error')
    }
  }

  changeType = (type) => {
    this.setState({ type })
  }

  render() {
    const { type } = this.state
    return (
      <div className={this.props.className}>
        <LoginForm
          type={type}
          onSubmit={this.handleSubmit}
          discourse
          changeType={this.changeType}
        />
      </div>
    )
  }
}

DiscourseLoginScreen.propTypes = {
  snackbar: PropTypes.func.isRequired,
  className: PropTypes.string,
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(null, mapDispatchToProps)(DiscourseLoginScreen)
