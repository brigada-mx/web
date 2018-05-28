import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import MetricsBar from 'components/MetricsBar'
import Styles from './CTAButton.css'


const CTAButton = ({ actionId, type, onClick, modal, opportunities }) => {
  const handleClick = () => {
    modal(`cta_${type}`, { actionId })
    if (onClick) onClick(actionId, type)
  }

  if (type === 'volunteer') {
    const value = opportunities.reduce((sum, o) => sum + (o.progress || 0), 0)
    const max = opportunities.reduce((sum, o) => sum + (o.target || 0), 0)
    const postings = opportunities.map((o, i) => <span key={i} className={Styles.posting}>{o.position}</span>)
    return (
      <div className={Styles.container} onClick={handleClick}>
        <div className={Styles.progress}>
          <span>Faltan {max - value} voluntarios</span>
          <MetricsBar value={value} max={max} />
        </div>
        <div>
          {postings}
        </div>
        <span className={Styles.button}>Postular</span>
      </div>
    )
  }
  return null
}

CTAButton.propTypes = {
  actionId: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['volunteer', 'donate', 'share']).isRequired,
  modal: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  opportunities: PropTypes.arrayOf(PropTypes.object),
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default connect(null, mapDispatchToProps)(CTAButton)
