/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import { connect } from 'react-redux'

import moment from 'moment'
import service, { getBackoff } from 'api/service'
import ReactTable from 'react-table'
import '!style-loader!css-loader!react-table/react-table.css'

import { tokenMatch, emailLink } from 'tools/string'
import GlobalStyles from 'src/Global.css'


const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined ? tokenMatch(String(row[id]), filter.value) : true
}

const ApplicationTable = ({ applications }) => {
  const columns = [
    {
      Header: 'Puesto',
      accessor: 'position',
    },
    {
      Header: 'Nombre completo',
      accessor: 'user.full_name',
    },
    {
      Header: 'Teléfono',
      accessor: 'user.phone',
    },
    {
      Header: 'Email',
      accessor: 'user.email',
      Cell: props => <a className={GlobalStyles.linkRaw} href={emailLink(props.original.user.email)}>{props.original.user.email}</a>, // eslint-disable-line max-len
    },
    {
      Header: 'Fecha',
      accessor: 'created',
      Cell: props => <span>{moment(props.original.created).format('DD MMMM YYYY')}</span>,
    },
  ]

  const maxPageSize = 10

  return (
    <ReactTable
      className="-highlight"
      pageSize={Math.min(applications.length, maxPageSize)}
      showPagination={applications.length > maxPageSize}
      data={applications}
      columns={columns}
      defaultFilterMethod={defaultFilterMethod}
    />
  )
}

ApplicationTable.propTypes = {
  applications: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const PureApplicationTable = pure(ApplicationTable)

class ApplicationTableWrapper extends React.Component {
  componentDidMount() {
    const { actionId } = this.props
    getBackoff(() => service.accountGetOpportunities(actionId), { key: `accountOpportunities_${actionId}` })
  }

  render() {
    const { opportunities } = this.props
    if (!opportunities) return null
    const applications = [].concat(...opportunities.map(
      o => o.applications.map((a) => { return { ...a, position: o.position, opportunityId: o.id } })
    ))
    if (applications.length === 0) return null

    return <PureApplicationTable applications={applications} />
  }
}

ApplicationTableWrapper.propTypes = {
  actionId: PropTypes.number.isRequired,
  opportunities: PropTypes.arrayOf(PropTypes.object),
}

const mapStateToProps = (state, { actionId }) => {
  try {
    return { opportunities: state.getter[`accountOpportunities_${actionId}`].data.results }
  } catch (e) {
    return {}
  }
}

export default connect(mapStateToProps, null)(ApplicationTableWrapper)
