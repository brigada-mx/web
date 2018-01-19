import React from 'react'
import PropTypes from 'prop-types'

import ReactSwipe from 'react-swipe'
import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import service, { getBackoffStateless } from 'api/service'
import Styles from './Carousel.css'


class CarouselContainer extends React.Component {
  componentDidMount() {
    getBackoffStateless(() => service.getAction(this.props.actionId), this.handleResponse)
  }

  componentWillUpdate(nextProps) {
    if (this.props.actionId === nextProps.actionId) return
    getBackoffStateless(() => service.getAction(nextProps.actionId), this.handleResponse)
  }

  handleResponse = ({ data, error, exception }) => {
    if (!data) return
    const { onActionData, actionId } = this.props
    onActionData(actionId, data)
  }

  render() {
    const { actionData } = this.props
    if (!actionData) return <LoadingIndicatorCircle />

    const submissions = actionData.submissions.map((s) => {
      const {
        action,
        data: { description, address },
        location,
        organization: organizationId,
        submitted,
        image_urls: urls,
        thumbnails_medium: urlsMedium,
        thumbnails_small: urlsSmall,
      } = s
      return urls.map((url, i) => {
        return {
          actionId: action,
          description,
          address,
          location,
          organizationId,
          submitted,
          url,
          urlMedium: urlsMedium[i],
          urlSmall: urlsSmall[i],
        }
      })
    })
    return <Carousel photos={[].concat(...submissions)} />
  }
}

CarouselContainer.propTypes = {
  actionId: PropTypes.number.isRequired,
  actionData: PropTypes.object,
  onActionData: PropTypes.func.isRequired,
}

const mapStateToProps = (state, props) => {
  return { actionData: state.action[props.actionId] }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onActionData: (id, data) => Actions.actionData(dispatch, { id, data }),
  }
}

class Carousel extends React.Component {
  render() {
    const { photos } = this.props
    console.log(photos)
    return (
      <ReactSwipe
        className={Styles.carousel}
        swipeOptions={{ continuous: false }}
      >
        <div>PANE 1</div>
        <div>PANE 2</div>
        <div>PANE 3</div>
      </ReactSwipe>
    )
  }
}

Carousel.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(CarouselContainer)
export { Carousel }
