import React from 'react'
import PropTypes from 'prop-types'

import ReactTable from 'react-table'
import { withRouter } from 'react-router-dom'
import '!style-loader!css-loader!react-table/react-table.css'

import { sectorByValue } from 'src/choices'
import { fmtBudget } from 'tools/string'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import Styles from './DonorListScreenView.css'


class DonorListScreenView extends React.Component {
  componentDidMount() {
    document.title = 'Donadores - Brigada'
  }

  renderAddress = (address = {}) => {
    const { locality, city } = address
    const parts = []
    if (locality) parts.push(locality)
    if (city) parts.push(city)
    return parts.join(', ')
  }

  render() {
    const { donors: { data: donorData, loading: donorLoading, error: donorError } } = this.props
    const { history } = this.props

    const donors = donorData ? donorData.results : []

    if (donorLoading) return <LoadingIndicatorCircle className={Styles.loader} />

    const columns = [
      {
        Header: 'Donador',
        accessor: 'name',
      },
      {
        Header: 'Ubicación',
        accessor: 'contact.address',
        Cell: props => this.renderAddress(props.original.contact.address) || 'No disponible',
      },
      {
        Header: 'Sector',
        accessor: 'sector',
        Cell: props => sectorByValue[props.original.sector] || 'No disponible',
      },
      {
        Header: 'Monto donado',
        accessor: 'metrics.total_donated',
        Cell: props => fmtBudget(props.original.metrics.total_donated),
      },
      {
        Header: 'Reconstructores',
        accessor: 'metrics.org_count',
      },
      {
        Header: 'Proyectos',
        accessor: 'metrics.action_count',
      },
    ]

    return (
      <div className={Styles.tableWrapper}>
        <ReactTable
          showPagination={false}
          showPageSizeOptions={false}
          className="donorTable"
          defaultPageSize={donors.length}
          data={donors}
          columns={columns}
          getTrProps={(state, rowInfo, column) => {
            const handleRowClicked = (e, handleOriginal) => {
              history.push(`/donadores/${rowInfo.original.id}`)
              if (handleOriginal) handleOriginal()
            }
            return {
              onClick: handleRowClicked,
              style: { cursor: 'pointer' },
            }
          }}
        />
      </div>
    )
  }
}

DonorListScreenView.propTypes = {
  donors: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(DonorListScreenView)
