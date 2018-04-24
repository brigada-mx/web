import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import ReactTable from 'react-table'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import '!style-loader!css-loader!react-table/react-table.css'

import * as Actions from 'src/actions'
import { sectorByValue } from 'src/choices'
import { fmtBudget, tokenMatch } from 'tools/string'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import SearchInput from 'components/SearchInput'
import Styles from './DonorListScreenView.css'


const defaultSorted = [
  {
    id: 'has_user',
    desc: true,
  },
  {
    id: 'metrics.total_donated',
    desc: true,
  },
]

class DonorListScreenView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      verifiedInfo: false,
    }
    this.handleSearchKeyUp = _.debounce(this.handleSearchKeyUp, 150)
  }

  componentDidMount() {
    document.title = 'Donadores - Brigada'
    window.addEventListener('orientationchange', this.orientationChange)
  }

  componentWillUnmount() {
    document.removeEventListener('orientationchange', this.orientationChange)
  }

  orientationChange = () => {
    this.setState({ orientation: screen.orientation.angle })
  }

  renderAddress = (address = {}) => {
    const { locality, city } = address
    const parts = []
    if (locality) parts.push(locality)
    if (city) parts.push(city)
    return parts.join(', ')
  }

  handleSearchKeyUp = (search) => {
    this.setState({ search })
  }

  setVerifiedInfo = (verifiedInfo) => {
    this.setState({ verifiedInfo })
  }

  render() {
    const { donors: { data: donorData, loading: donorLoading, error: donorError } } = this.props
    const { modal, history } = this.props
    const { search, verifiedInfo } = this.state

    const donors = donorData ? donorData.results : []

    if (donorLoading) return <LoadingIndicatorCircle className={Styles.loader} />

    const columns = [
      {
        Header: 'Donador',
        accessor: 'name',
      },
      {
        Header: 'Monto donado',
        accessor: 'metrics.total_donated',
        Cell: props => fmtBudget(props.original.metrics.total_donated),
      },
    ]
    if (window.innerWidth >= 600) {
      columns.splice(1, 0, {
        Header: 'Proyectos',
        accessor: 'metrics.action_count',
      })
      columns.splice(1, 0, {
        Header: 'Reconstructores',
        accessor: 'metrics.org_count',
      })
    }
    if (window.innerWidth >= 980) {
      columns.splice(1, 0, {
        Header: 'Convocatoria abierta',
        accessor: 'donating',
        Cell: (props) => { return props.original.donating ? 'Sí' : 'No' },
      })
      columns.push({
        Header: () => (
          <div>
            {verifiedInfo &&
              <div className={Styles.tooltip}>¿El donador ha verificado su información?</div>
            }
            <span>Estatus</span>
            <span
              className={Styles.verifiedInfo}
              onMouseEnter={() => this.setVerifiedInfo(true)}
              onMouseLeave={() => this.setVerifiedInfo(false)}
            >
            </span>
          </div>
        ),
        accessor: 'has_user',
        Cell: (props) => {
          const src = props.original.has_user ? 'assets/img/circle-checkmark-accent.svg' : 'assets/img/circle-checkmark.svg'
          const alt = props.original.has_user ? 'Sí' : 'No'
          return <img src={src} alt={alt} height="19px" className={Styles.checkmark} />
        },
      })
    }

    const filtered = donors.filter((d) => {
      if (!search) return true
      return tokenMatch(d.name, search)
    })

    return (
      <React.Fragment>
        <div className={`${Styles.searchContainer} row middle between wrapper`}>
          <span
            className={Styles.cta}
            onClick={() => modal('donorCreateAccount')}
          >
            Crear tu cuenta
          </span>
          <SearchInput numResults={filtered.length} onKeyUp={this.handleSearchKeyUp} />
        </div>
        <div className={Styles.tableWrapper}>
          <ReactTable
            showPagination={false}
            showPageSizeOptions={false}
            className="donorTable"
            pageSize={filtered.length}
            data={filtered}
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
            defaultSorted={defaultSorted}
          />
        </div>
      </React.Fragment>
    )
  }
}

DonorListScreenView.propTypes = {
  donors: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  modal: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default withRouter(connect(null, mapDispatchToProps)(DonorListScreenView))
