import React from 'react'
import PropTypes from 'prop-types'

import Modal from 'components/Modal'
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
    const { help, helpDesc = '', organizationId } = this.props
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
              <span className={FormStyles.formHeader}>Estamos buscando voluntarios</span>
              <p className={FormStyles.formText}>{helpDesc}</p>
            </div>
          </Modal>
        }

        <div className={Styles.helpContainer}>
          <span className={Styles.infoText}>Estamos recibiendo voluntarios</span>
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
  helpDesc: PropTypes.string,
  organizationId: PropTypes.number.isRequired,
}

export default HelpWanted
