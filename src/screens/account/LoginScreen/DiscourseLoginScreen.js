import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import { parseQs } from 'tools/string'
import service from 'api/service'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import LoginForm from './LoginForm'


class DiscourseLoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'org',
      loading: true,
    }
  }

  async componentDidMount() {
    const { orgToken, donorToken } = this.props
    const params = parseQs(window.location.search)
    const { sso, sig } = params

    let data
    if (orgToken) {
      ({ data } = await service.accountDiscourseLogin(sso, sig))
    } else if (donorToken) {
      ({ data } = await service.donorDiscourseLogin(sso, sig))
    }
    if (data) {
      window.location.replace(`https://foro.brigada.mx/session/sso_login?sso=${data.sso}&sig=${data.sig}`)
    }
    this.setState({ loading: false })
  }

  handleSubmit = async ({ email, password }) => {
    const { type } = this.state

    const params = parseQs(window.location.search)
    const { sso, sig } = params

    const { data } = await service.discourseLogin(email, password, sso, sig, type)
    if (data) {
      window.location.replace(`https://foro.brigada.mx/session/sso_login?sso=${data.sso}&sig=${data.sig}`)
    } else {
      this.props.snackbar('No reconocemos este email/contraseña', 'error')
    }
  }

  changeType = (type) => {
    this.setState({ type })
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorCircle />
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
  orgToken: PropTypes.string,
  donorToken: PropTypes.string,
}

const mapStateToProps = (state) => {
  const { token: orgToken } = state.auth.org || {}
  const { token: donorToken } = state.auth.donor || {}
  return { orgToken, donorToken }
}

const mapDispatchToProps = (dispatch) => {
  return {
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscourseLoginScreen)
