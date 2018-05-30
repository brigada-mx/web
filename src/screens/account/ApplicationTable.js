/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import { connect } from 'react-redux'

import moment from 'moment'
import service, { getBackoff } from 'api/service'
import ReactTable from 'react-table'
import '!style-loader!css-loader!react-table/react-table.css'

import { tokenMatch } from 'tools/string'
import FormStyles from 'src/Form.css'


const defaultFilterMethod = (filter, row) => {
  const id = filter.pivotId || filter.id
  return row[id] !== undefined ? tokenMatch(String(row[id]), filter.value) : true
}

const ApplicationTable = ({ applications }) => {
  const columns = [
    {
      Header: 'Nombre completo',
      accessor: 'user.full_name',
    },
    {
      Header: 'Edad',
      accessor: 'user.age',
    },
    {
      Header: 'Teléfono',
      accessor: 'user.phone',
    },
    {
      Header: 'Email',
      accessor: 'user.email',
    },
    {
      Header: 'Fecha de creación',
      accessor: 'created',
      Cell: props => <span>{moment(props.original.created).format('h:mma, DD MMMM YYYY')}</span>,
    },
  ]

  const maxPageSize = 20

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
    const { opportunityId } = this.props
    getBackoff(() => service.accountGetOpportunity(opportunityId), { key: `accountOpportunity_${opportunityId}` })
  }

  render() {
    const { opportunity } = this.props
    if (!opportunity || opportunity.applications.length === 0) return null
    return (
      <React.Fragment>
        <div className={`${FormStyles.sectionHeader} ${FormStyles.sectionDivider}`}>Aplicaciones</div>
        <PureApplicationTable applications={opportunity.applications} />
      </React.Fragment>
    )
  }
}

ApplicationTableWrapper.propTypes = {
  opportunityId: PropTypes.number.isRequired,
  opportunity: PropTypes.object,
}

const mapStateToProps = (state, { opportunityId }) => {
  try {
    return { opportunity: state.getter[`accountOpportunity_${opportunityId}`].data }
  } catch (e) {
    return {}
  }
}

export default connect(mapStateToProps, null)(ApplicationTableWrapper)
