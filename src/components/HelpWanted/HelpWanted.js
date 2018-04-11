import React from 'react'
import PropTypes from 'prop-types'

import RaisedButton from 'material-ui/RaisedButton'
import ReactGA from 'react-ga'

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
    const { help, helpDesc = '', groupId, email, type } = this.props
    const { modal } = this.state

    const title = { volunteer: 'Buscamos voluntarios', donation: 'Estamos financiando nuevos proyectos' }[type]
    const emailLinkText = {
      volunteer: 'Me interesa ser voluntario',
      donation: 'Me interesa conseguir apoyo para mi proyecto',
    }[type]

    if (!help) return null
    return (
      <React.Fragment>
        {modal &&
          <Modal
            contentClassName={Styles.modalContainer}
            onClose={this.handleClose}
            gaName={`${type}/${groupId}`}
          >
            <div className={Styles.modalContent}>
              <span className={Styles.helpTitle}>{title}</span>
              <p className={Styles.helpText}>{helpDesc}</p>
              <div className={FormStyles.buttonContainer}>
                {email && <RaisedButton
                  containerElement={
                    <ReactGA.OutboundLink
                      eventLabel={`${type}Email/${groupId}`}
                      to={emailLink(email, emailLinkText)}
                    />
                  }
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
          <span className={Styles.infoText}>{title}</span>
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
  groupId: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['volunteer', 'donation']).isRequired,
}

export default HelpWanted
