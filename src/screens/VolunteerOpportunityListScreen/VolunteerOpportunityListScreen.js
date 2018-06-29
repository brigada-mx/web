import React from 'react'
import PropTypes from 'prop-types'
import lifecycle from 'recompose/lifecycle'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import { fireGaEvent, setDocumentMeta } from 'tools/other'
import { truncate } from 'tools/string'
import service, { getBackoff } from 'api/service'
import pluralize from 'tools/pluralize'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import Styles from './VolunteerOpportunityListScreen.css'


const VolunteerOpportunityListScreen = ({ opportunities, history, modal }) => {
  const header = (
    <React.Fragment>
      <div className={`${Styles.header} sm-hidden xs-hidden`}>Ayuda a que familias damnificadas<br />reconstruyan sus vidas.</div>
      <div className={`${Styles.header} lg-hidden md-hidden`}>Ayuda a que familias damnificadas reconstruyan sus vidas.</div>
      <div className={Styles.subHeader}>Únete como voluntario de Brigada.</div>
    </React.Fragment>
  )
  if (!opportunities) {
    return (
      <React.Fragment>
        <div className={Styles.container}>{header}<LoadingIndicatorCircle /></div>
      </React.Fragment>
    )
  }

  const items = opportunities.map((o) => {
    const {
      id,
      action: { organization: { name: orgName }, locality: { name: locName, state_name: stateName } },
      position,
      target,
      preview: { type, src, youtube_video_id: videoId } = {},
    } = o

    let image = <div className={Styles.emptyThumbnail} />
    if (type === 'image' && src) {
      const backgroundImage = `url("${src}")`
      image = <div className={Styles.image} style={{ backgroundImage }} />
    }
    if (type === 'video' && src) {
      const handleClickVideo = (e) => {
        e.stopPropagation()
        modal('youTubeVideo', { modalTransparent: true, videoId })
      }
      const backgroundImage = `url("${src}")`
      image = <div onClick={handleClickVideo} className={Styles.video} style={{ backgroundImage }} />
    }

    const messageText = `busca ${target} ${target !== 1 ? pluralize(position.toLowerCase()) : position.toLowerCase()} en ${locName}, ${stateName}.`
    const message = (
      <span><span className={Styles.bold}>{orgName}</span> {truncate(messageText, 100 - orgName.length)}</span>
    )

    const handleClick = () => {
      fireGaEvent('volunteerOpportunityListScreenClicked', `oppId: ${id}, ${orgName}`)
      history.push(`/voluntariado/${id}`)
    }

    return (
      <div key={id} className={Styles.card} onClick={handleClick}>
        {image}
        <div className={Styles.message}>
          {message}
        </div>
      </div>
    )
  })
  const cardsPerRow = 3
  const remainder = opportunities.length % cardsPerRow
  if (remainder) {
    for (let c = 0; c < cardsPerRow - remainder; c += 1) {
      items.push(
        <div className={Styles.emptyCard} key={c} />
      )
    }
  }

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.container}>
        {header}
        <div className={Styles.cardContainer}>
          {items}
        </div>
      </div>
      <div className={Styles.bg} />
    </div>
  )
}

VolunteerOpportunityListScreen.propTypes = {
  opportunities: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.object.isRequired,
  modal: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  try {
    return { opportunities: state.getter.opportunities.data.results }
  } catch (e) {
    return {}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default lifecycle({
  componentDidMount() {
    getBackoff(service.getOpportunities, { key: 'opportunities' })
    setDocumentMeta('Oportunidades de Voluntariado - Brigada', 'Ayuda a que familias damnificadas reconstruyan sus vidas. Únete como voluntario de Brigada.')
  },
})(withRouter(connect(mapStateToProps, mapDispatchToProps)(VolunteerOpportunityListScreen)))
