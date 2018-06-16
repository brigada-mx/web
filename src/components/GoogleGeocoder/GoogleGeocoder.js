import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import AutoComplete from 'material-ui/AutoComplete'

import { sendToUrl } from 'api/request'
import Styles from './GoogleGeocoder.css'


class GoogleGeocoder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
    }
    this.handleUpdateInput = _.debounce(this.handleUpdateInput, 200)
  }

  // https://v0.material-ui.com/#/components/auto-complete
  handleSelect = (chosenItem, index) => {
    if (index === -1) return
    this.props.onSelect(chosenItem.value)
  }

  handleUpdateInput = async (search) => {
    if (!search || search.length < 3) {
      this.setState({ results: [] })
      return
    }

    const { apiKey } = this.props
    const params = { address: search, language: 'es', region: 'mx' }
    if (apiKey) params.key = apiKey

    const { data } = await sendToUrl('https://maps.googleapis.com/maps/api/geocode/json', { params })
    if (!data) return

    this.setState({ results: data.results })
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
        floatingLabelText="Buscar lugar"
        dataSource={dataSource}
        onUpdateInput={this.handleUpdateInput}
        onNewRequest={this.handleSelect}
        filter={this.filter}
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
