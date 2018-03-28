import React from 'react'
import PropTypes from 'prop-types'

import RaisedButton from 'material-ui/RaisedButton'

import Modal from 'components/Modal'
import { emailLink } from 'tools/string'
import FormStyles from 'src/Form.css'
import GlobalStyles from 'src/Global.css'
import Styles from './HelpWanted.css'


class HelpWanted extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
    }
  }

  handleClick = () => {
    this.setState({ modal: true })
  }

  handleClose = () => {
    this.setState({ modal: false })
  }

  render() {
    const { help, helpDesc = '', organizationId, email } = this.props
    const { modal } = this.state

    if (!help) return null
    return (
      <React.Fragment>
        {modal &&
          <Modal
            contentClassName={Styles.modalContainer}
            onClose={this.handleClose}
            gaName={`volunteer/${organizationId}`}
          >
            <div className={Styles.modalContent}>
              <span className={Styles.helpTitle}>Buscamos voluntarios</span>
              <p className={Styles.helpText}>{helpDesc}</p>
              <div className={FormStyles.buttonContainer}>
                {email && <RaisedButton
                  containerElement={<a href={emailLink(email, 'Me interesa ser voluntario')} target="_blank" />}
                  backgroundColor="#3DC59F"
                  labelColor="#ffffff"
                  className={FormStyles.primaryButton}
                  label="ME INTERESA"
                />}
              </div>
            </div>
          </Modal>
        }

        <div className={Styles.helpContainer}>
          <span className={Styles.infoText}>Buscamos voluntarios</span>
          <span
            className={`${GlobalStyles.link} ${Styles.linkText}`}
            onClick={this.handleClick}
          >
            Contáctanos
          </span>
        </div>
      </React.Fragment>
    )
  }
}

HelpWanted.propTypes = {
  help: PropTypes.bool,
  email: PropTypes.string,
  helpDesc: PropTypes.string,
  organizationId: PropTypes.number.isRequired,
}

export default HelpWanted
