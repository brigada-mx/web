import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import service from 'api/service'
import LoginForm from './LoginForm'


class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formState: null,
    }
  }

  handleSubmitLogin = async (email, password) => {
    this.setState({ formState: 'submitting' })
    const { data } = await service.token(email, password)
    if (data) {
      this.setState({ formState: null })
      this.props.onLogin({ ...data, email })
    } else {
      this.setState({ formState: 'error' })
    }
  }

  render() {
    const { formState } = this.state
    return (
      <LoginForm
        error={formState === 'error'}
        disabled={formState === 'submitting'}
        onSubmitLogin={this.handleSubmitLogin}
      />
    )
  }
}

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: auth => Actions.authSet(dispatch, { auth }),
  }
}

export default connect(null, mapDispatchToProps)(LoginScreen)
