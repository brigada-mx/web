import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import AutoComplete from 'material-ui/AutoComplete'


class GoogleGeocoder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
    }
    this.handleUpdateInput = _.debounce(this.handleUpdateInput, 200)
  }

  componentDidMount() {
    if (window.google) return
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.props.apiKey}`
    document.head.appendChild(script)
  }

  // https://v0.material-ui.com/#/components/auto-complete
  handleSelect = (chosenItem, index) => {
    if (index === -1) return
    this.props.onSelect(chosenItem.value)
  }

  handleUpdateInput = async (search) => {
    if (!window.google) return
    if (!this._geocoder) this._geocoder = new google.maps.Geocoder()

    if (!search || search.length < 3) {
      this.setState({ results: [] })
      return
    }

    const params = { address: search, region: 'mx' }
    this._geocoder.geocode(params, (results) => {
      this.setState({ results })
    })
  }

  filter = () => {
    return true
  }

  render() {
    const { numResults, className, filter } = this.props

    let dataSource = this.state.results.map((r) => {
      return { text: r.formatted_address, value: r }
    })
    if (numResults) dataSource = dataSource.slice(0, numResults)
    if (filter) dataSource = dataSource.filter(d => filter(d))

    return (
      <AutoComplete
        className={className}
        floatingLabelText="Buscar lugar o dar click en el mapa"
        dataSource={dataSource}
        onUpdateInput={this.handleUpdateInput}
        onNewRequest={this.handleSelect}
        filter={this.filter}
        fullWidth
      />
    )
  }
}

GoogleGeocoder.propTypes = {
  onSelect: PropTypes.func.isRequired,
  filter: PropTypes.func,
  numResults: PropTypes.number,
  apiKey: PropTypes.string,
  className: PropTypes.string,
}

export default GoogleGeocoder
