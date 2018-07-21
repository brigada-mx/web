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
    const { modal, history, innerWidth = window.innerWidth } = this.props
    const { search } = this.state

    const donors = donorData ? donorData.results : []

    if (donorLoading) return <LoadingIndicatorCircle className={Styles.loader} />

    const columns = [
      {
        Header: 'Donador',
        accessor: 'name',
        className: Styles.noOverflow,
        Cell: (_props) => {
          const { name, donations, has_user: hasUser } = _props.original
          const transparent = donations.length > 0 && hasUser && donations.every(d => d.action.level >= 3)
          return (
            <div className="row">
              <span className={Styles.donor}>{name}</span>
              {transparent &&
                <Icon
                  src="/assets/img/circle-checkmark-accent.svg"
                  alt="Organización transparente"
                  height={25}
                  ttText="Todos los proyectos de este donador cumplen con criterios mínimos de transparencia establecidos en conjunto con Alternativas y Capacidades A.C."
                  ttTop={-90}
                  ttWidth={360}
                  ttLeft={-18}
                  className={Styles.checkmark}
                  position="left"
                />
              }
            </div>
          )
        },
      },
      {
        Header: 'Monto donado',
        maxWidth: 260,
        accessor: 'metrics.total_donated',
        Cell: props => fmtBudget(props.original.metrics.total_donated),
      },
    ]
    if (innerWidth >= 600) {
      columns.splice(1, 0, {
        Header: 'Proyectos',
        maxWidth: 260,
        accessor: 'metrics.action_count',
      })
      columns.splice(1, 0, {
        Header: 'Reconstructores',
        maxWidth: 260,
        accessor: 'metrics.org_count',
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
  innerWidth: PropTypes.number,
}

const mapStateToProps = (state) => {
  const { innerWidth } = state.window
  return { innerWidth }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DonorListScreenView))
