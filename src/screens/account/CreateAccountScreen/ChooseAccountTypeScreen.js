import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'

import * as Actions from 'src/actions'
import FormStyles from 'src/Form.css'
import Styles from './ChooseAccountTypeScreen.css'


const buttonStyle = {
  marginLeft: 20,
  marginTop: 25,
}

const labelStyle = {
  fontSize: 20,
  color: '#CACCD5',
}

const greenIconStyle = {
  fill: '#3DC59F',
}

class ChooseAccountTypeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: props.type,
    }
  }

  handleSubmit = () => {
    const modal = this.state.type === 'org' ? 'createAccount' : 'donorCreateAccount'
    this.props.modal(modal)
  }

  openChat = () => {
    this.props.livechat(true)
  }

  handleChange = (event, value) => {
    this.setState({ type: value })
  }

  render() {
    const { className } = this.props
    const { type } = this.state

    const content = (
      <form
        className={FormStyles.formContainer}
      >
        <span className={FormStyles.formLogo} />
        <span className={FormStyles.formHeader}>Registro para Brigada</span>
        <p className={Styles.question}>¿Con qué tipo de cuenta te quieres dar de alta?</p>

        <RadioButtonGroup name="type" defaultSelected={this.props.type} onChange={this.handleChange} className={FormStyles.radioButtonGroup}>
          <RadioButton
            value="org"
            label="Reconstructor: Trabajamos directamente en las comunidades afectadas por los sismos"
            style={buttonStyle}
            labelStyle={labelStyle}
            iconStyle={greenIconStyle}
          />
          <RadioButton
            value="donor"
            label="Donador: Financiamos proyectos en las comunidades afectadas"
            style={buttonStyle}
            labelStyle={labelStyle}
            iconStyle={greenIconStyle}
          />
        </RadioButtonGroup>

        <div className={FormStyles.buttonContainer}>
          <RaisedButton
            className={FormStyles.primaryButton}
            backgroundColor="#3DC59F"
            labelColor="#ffffff"
            disabled={!type}
            label="AVANZAR"
            onClick={this.handleSubmit}
          />
          <span onClick={this.openChat} className={Styles.link}>Chat de ayuda</span>
        </div>
      </form>
    )

    if (className) return <div className={className}>{content}</div>
    return content
  }
}

ChooseAccountTypeScreen.propTypes = {
  type: PropTypes.oneOf(['org', 'donor']),
  modal: PropTypes.func.isRequired,
  livechat: PropTypes.func.isRequired,
  className: PropTypes.string,
}

ChooseAccountTypeScreen.defaultProps = {
  type: 'org',
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
    livechat: open => Actions.livechat(dispatch, { open }),
  }
}

export default connect(null, mapDispatchToProps)(ChooseAccountTypeScreen)
