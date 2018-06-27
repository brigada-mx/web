import React from 'react'
import PropTypes from 'prop-types'
import lifecycle from 'recompose/lifecycle'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as Actions from 'src/actions'
import service, { getBackoff } from 'api/service'
import pluralize from 'tools/pluralize'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import Styles from './VolunteerOpportunityListScreen.css'


const VolunteerOpportunityListScreen = ({ opportunities, history, modal }) => {
  const header = (
    <React.Fragment>
      <div className={Styles.header}>Ayuda a que personas damnificadas<br />reconstruyan sus vidas.</div>
      <div className={Styles.subHeader}>Conoce un proyecto que necesita voluntarios. Todos son transparentes.</div>
    </React.Fragment>
  )
  if (!opportunities) return <div className={Styles.container}>{header}<LoadingIndicatorCircle /></div>

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

    const message = (
      <span>
        <span className={Styles.bold}>{orgName}</span> busca {target} {target !== 1 ? pluralize(position.toLowerCase()) : position.toLowerCase()} en {locName}, {stateName}.
      </span>
    )

    const handleClick = () => {
      history.push(`/voluntariado/${id}`)
    }

    return (
      <div key={id} className={Styles.itemContainer} onClick={handleClick}>
        {image}
        <div className={Styles.message}>
          {message}
        </div>
      </div>
    )
  })

  return (
    <div className={Styles.container}>
      {header}
      {items}
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
  },
})(withRouter(connect(mapStateToProps, mapDispatchToProps)(VolunteerOpportunityListScreen)))
