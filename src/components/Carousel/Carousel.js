import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import Swiper from 'react-id-swiper'
import '!style-loader!css-loader!swiper/dist/css/swiper.css'

import * as Actions from 'src/actions'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import service, { getBackoffStateless } from 'api/service'
import { distanceKmBetweenCoords } from 'tools/other'
import Styles from './Carousel.css'
import Photo from './Photo'


const maxMetersGroupSubmissions = 50

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
    const { actionId, actionData, onActionData, lat, lng, ...rest } = this.props
    if (!actionData) return <LoadingIndicatorCircle />

    const submissions = actionData.submissions.map((s) => {
      const {
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
    let filtered = [].concat(...submissions)
    if (lat && lng) {
      filtered = filtered.filter((s) => {
        if (!s.location) return false
        const { lat: _lat, lng: _lng } = s.location
        return distanceKmBetweenCoords(lat, lng, _lat, _lng) * 1000 < maxMetersGroupSubmissions
      })
    }
    return <CarouselView key={filtered.length} {...rest} photos={filtered} />
  }
}

CarouselContainer.propTypes = {
  actionId: PropTypes.number.isRequired,
  actionData: PropTypes.object,
  lat: PropTypes.number,
  lng: PropTypes.number,
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

class CarouselView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
    }
    this.swiperParams = {
      slidesPerView: 2,
      spaceBetween: 100,
      centeredSlides: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  componentWillUpdate(nextProps) {
    if (this.props.photos !== nextProps.photos) this.setState({ index: 0 })
  }

  handleKeyDown = (e) => {
    try {
      if (e.keyCode === 27) this.props.onClose() // 8 is keyCode for delete key
      if (e.keyCode === 37) this.swiper.slidePrev()
      if (e.keyCode === 39) this.swiper.slideNext()
    } catch (exception) {}
  }

  setSwiperRef = (ref) => {
    if (!ref) return
    this.swiper = ref.swiper
    this.swiper.on('slideChange', () => this.setState({ index: this.swiper.activeIndex }))
  }

  render() {
    const { photos, onClose } = this.props
    const panes = photos.map((p, i) => {
      if (Math.abs(this.state.index - i) <= 1) {
        return <div key={p.url}><Photo {...p} /></div>
      }
      return <div key={p.url}><Photo {...p} lazyLoad /></div>
    })
    return (
      <div className={Styles.container}>
        <span className={Styles.progress}>{this.state.index + 1} / {panes.length}</span>
        <span className={Styles.closeButton} onClick={onClose} />
        <Swiper
          {...this.swiperParams}
          ref={this.setSwiperRef}
        >
          {panes}
        </Swiper>
      </div>
    )
  }
}

CarouselView.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(CarouselContainer)
export { CarouselView }
