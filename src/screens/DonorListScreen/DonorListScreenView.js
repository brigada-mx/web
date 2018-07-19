import React from 'react'
import PropTypes from 'prop-types'

import debounce from 'lodash/debounce'
import ReactTable from 'react-table'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import '!style-loader!css-loader!react-table/react-table.css'

import * as Actions from 'src/actions'
import { fmtBudget, tokenMatch } from 'tools/string'
import LoadingIndicatorCircle from 'components/LoadingIndicator/LoadingIndicatorCircle'
import SearchInput from 'components/SearchInput'
import Icon from 'components/Icon'
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
    }
    this.handleSearchKeyUp = debounce(this.handleSearchKeyUp, 150)
  }

  componentDidMount() {
    document.title = 'Donadores - Brigada'
    window.addEventListener('orientationchange', this.forceUpdate)
  }

  componentWillUnmount() {
    document.removeEventListener('orientationchange', this.forceUpdate)
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

  render() {
    const { donors: { data: donorData, loading: donorLoading } } = this.props
    const { modal, history } = this.props
    const { search } = this.state

    const donors = donorData ? donorData.results : []

    if (donorLoading) return <LoadingIndicatorCircle className={Styles.loader} />

    const columns = [
      {
        Header: 'Donador',
        accessor: 'name',
        Cell: (_props) => {
          const { name, donations } = _props.original
          const transparent = donations.length > 0 && donations.every(d => d.action.level >= 3)
          return (
            <div className="row">
              {transparent &&
                <Icon
                  src="/assets/img/circle-checkmark-accent.svg"
                  alt="Organización transparente"
                  height={25}
                  ttText="Todos los proyectos de este donador son transparentes, de acuerdo con criterios mínimos de transparencia establecidos en conjunto con Alternativas y Capacidades A.C."
                  ttTop={-63}
                  ttWidth={400}
                  className={Styles.checkmark}
                />
              }
              {name}
            </div>
          )
        },
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
            noDataText=""
            getTrProps={(state, rowInfo) => {
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
