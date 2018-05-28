import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import Select from 'react-select'
import { withRouter } from 'react-router-dom'
import '!style-loader!css-loader!react-select/dist/react-select.css'

import MultiSelect from 'components/MultiSelect'
import { parseQs } from 'tools/string'
import { toQs } from 'api/request'
import { projectTypeByValue } from 'src/choices'
import Styles from './FilterHeader.css'


const margOptions = [
  { value: 'muy_alto', label: 'Muy alto' },
  { value: 'alto', label: 'Alto' },
  { value: 'medio', label: 'Medio' },
  { value: 'bajo', label: 'Bajo' },
  { value: 'muy_bajo', label: 'Muy bajo' },
]

const numActionsOptions = [
  { value: '0', label: '0' },
  { value: '1', label: '1-9' },
  { value: '2', label: '10-49' },
  { value: '3', label: '50+' },
]

const sectorOptions = [
  { value: 'civil', label: 'Civil' },
  { value: 'public', label: 'Público' },
  { value: 'private', label: 'Privado' },
  { value: 'religious', label: 'Religioso' },
]

export const parseFilterQueryParams = (location) => {
  const fieldByParam = {
    est: 'valState',
    mun: 'valMuni',
    rez_soc: 'valMarg',
    num_pro: 'valNumActions',
    sec: 'valSector',
    tip_pro: 'valActionType',
  }
  const obj = parseQs(location.search)
  const fields = {}

  for (const param of ['est', 'mun', 'rez_soc', 'num_pro', 'sec', 'tip_pro', 'vol']) {
    if (param in obj) {
      fields[fieldByParam[param]] = obj[param].split(',').map((value) => { return { value } })
    }
  }
  return fields
}

class FilterHeader extends React.Component {
  handleChangeValues = (values, field) => {
    const { history, location } = this.props
    const obj = parseQs(location.search)

    if (field === 'est' && !obj.est && obj.mun) obj.mun = undefined
    if (field === 'mun' && !obj.mun && obj.est) obj.est = undefined
    obj[field] = values.map(v => v.value).join(',') || undefined

    history.replace({ pathname: location.pathname, search: toQs(obj, { encode: false }) })
  }

  render() {
    const {
      localities = [],
      actions = [],
      style = {},
      valState,
      valMuni,
      valMarg,
      valNumActions,
      valSector,
      valActionType,
    } = this.props

    const shortenState = (name) => {
      if (name.toLowerCase() === 'veracruz de ignacio de la llave') return 'Veracruz'
      return name
    }

    const stateOptions = () => {
      const items = _.uniqBy(localities, l => l.cvegeo_state)

      return items.sort((a, b) => {
        if (a.state_name < b.state_name) return -1
        if (a.state_name > b.state_name) return 1
        return 0
      }).map((i) => {
        return { value: i.cvegeo_state, label: shortenState(i.state_name) }
      })
    }

    const muniOptions = () => {
      const items = _.uniqBy(localities, l => l.cvegeo_municipality)

      return items.sort((a, b) => {
        if (a.municipality_name < b.municipality_name) return -1
        if (a.municipality_name > b.municipality_name) return 1
        return 0
      }).map((i) => {
        return { value: i.cvegeo_municipality, label: `${i.municipality_name}, ${i.state_name}` }
      })
    }

    const actionTypeOptions = () => {
      const items = _.uniqBy(actions, a => a.action_type)

      return items.sort((a, b) => {
        if (a.action_type < b.action_type) return -1
        if (a.action_type > b.action_type) return 1
        return 0
      }).map((i) => {
        return { value: i.action_type, label: projectTypeByValue[i.action_type] || '?' }
      })
    }

    const selectsLarge = () => {
      return (
        <React.Fragment>
          {valState && <MultiSelect
            multi
            joinValues
            noResultsText="Cero resultados"
            clearable={false}
            closeOnSelect={false}
            removeSelected={false}
            className={`${Styles.filter} ${Styles.stateFilter}`}
            value={valState}
            placeholder="Estado"
            multiLabel="Estado"
            onChange={values => this.handleChangeValues(values, 'est')}
            options={stateOptions()}
          />}

          {valMuni && <MultiSelect
            multi
            noResultsText="Cero resultados"
            clearable={false}
            closeOnSelect={false}
            removeSelected={false}
            className={`${Styles.filter} ${Styles.muniFilter}`}
            value={valMuni}
            placeholder="Municipio"
            multiLabel="Municipio"
            onChange={values => this.handleChangeValues(values, 'mun')}
            options={muniOptions()}
          />}

          {valMarg && <MultiSelect
            multi
            noResultsText="Cero resultados"
            clearable={false}
            closeOnSelect={false}
            removeSelected={false}
            className={`${Styles.filter} ${Styles.margFilter}`}
            value={valMarg}
            placeholder="Rezago social"
            multiLabel="Rezago"
            onChange={values => this.handleChangeValues(values, 'rez_soc')}
            options={margOptions}
          />}

          {valNumActions && <MultiSelect
            multi
            noResultsText="Cero resultados"
            clearable={false}
            closeOnSelect={false}
            removeSelected={false}
            className={`${Styles.filter} ${Styles.totalFilter}`}
            value={valNumActions}
            placeholder="Total de proyectos"
            multiLabel="Proyectos"
            onChange={values => this.handleChangeValues(values, 'num_pro')}
            options={numActionsOptions}
          />}

          {valSector && <MultiSelect
            multi
            noResultsText="Cero resultados"
            clearable={false}
            closeOnSelect={false}
            removeSelected={false}
            className={`${Styles.filter} ${Styles.sectorFilter}`}
            value={valSector}
            placeholder="Sector"
            multiLabel="Sector"
            onChange={values => this.handleChangeValues(values, 'sec')}
            options={sectorOptions}
          />}

          {valActionType && <MultiSelect
            multi
            noResultsText="Cero resultados"
            clearable={false}
            closeOnSelect={false}
            removeSelected={false}
            className={`${Styles.filter} ${Styles.typeFilter}`}
            value={valActionType}
            placeholder="Tipo de proyecto"
            multiLabel="Tipo"
            onChange={values => this.handleChangeValues(values, 'tip_pro')}
            options={actionTypeOptions()}
          />}
        </React.Fragment>
      )
    }

    const selectsSmall = () => {
      return (
        <React.Fragment>
          {valMarg &&
            <React.Fragment>
              <span className={Styles.title}>Rezago social</span>
              <Select
                multi
                autoFocus
                openOnFocus
                noResultsText="Cero resultados"
                clearable={false}
                closeOnSelect={false}
                removeSelected={false}
                searchable={false}
                className={Styles.filter}
                value={valMarg}
                placeholder=""
                onChange={values => this.handleChangeValues(values, 'rez_soc')}
                options={margOptions}
              />
            </React.Fragment>
          }

          {valNumActions &&
            <React.Fragment>
              <span className={Styles.title}>Total de proyectos</span>
              <Select
                multi
                noResultsText="Cero resultados"
                clearable={false}
                closeOnSelect={false}
                removeSelected={false}
                searchable={false}
                className={Styles.filter}
                value={valNumActions}
                placeholder=""
                onChange={values => this.handleChangeValues(values, 'num_pro')}
                options={numActionsOptions}
              />
            </React.Fragment>
          }

          {valSector &&
            <React.Fragment>
              <span className={Styles.title}>Sector</span>
              <Select
                multi
                autoFocus
                openOnFocus
                noResultsText="Cero resultados"
                clearable={false}
                closeOnSelect={false}
                removeSelected={false}
                searchable={false}
                className={Styles.filter}
                value={valSector}
                placeholder=""
                onChange={values => this.handleChangeValues(values, 'sec')}
                options={sectorOptions}
              />
            </React.Fragment>
          }

          {valActionType &&
            <React.Fragment>
              <span className={Styles.title}>Tipo de proyecto</span>
              <Select
                multi
                noResultsText="Cero resultados"
                clearable={false}
                closeOnSelect={false}
                removeSelected={false}
                searchable={false}
                className={Styles.filter}
                value={valActionType}
                placeholder=""
                onChange={values => this.handleChangeValues(values, 'tip_pro')}
                options={actionTypeOptions()}
              />
            </React.Fragment>
          }

          {valState &&
            <React.Fragment>
              <span className={Styles.title}>Estado</span>
              <Select
                multi
                joinValues
                noResultsText="Cero resultados"
                clearable={false}
                closeOnSelect={false}
                removeSelected={false}
                searchable={false}
                className={Styles.filter}
                value={valState}
                placeholder=""
                onChange={values => this.handleChangeValues(values, 'est')}
                options={stateOptions()}
              />
            </React.Fragment>
          }

          {valMuni &&
            <React.Fragment>
              <span className={Styles.title}>Municipio</span>
              <Select
                multi
                noResultsText="Cero resultados"
                clearable={false}
                closeOnSelect={false}
                removeSelected={false}
                searchable={false}
                className={Styles.filter}
                value={valMuni}
                placeholder=""
                onChange={values => this.handleChangeValues(values, 'mun')}
                options={muniOptions()}
              />
            </React.Fragment>
          }
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <div style={style} className={`${Styles.container} sm-hidden xs-hidden`}>
          {selectsLarge()}
        </div>
        <div style={style} className={`${Styles.container} lg-hidden md-hidden wrapper-sm wrapper-xs`}>
          {selectsSmall()}
        </div>
      </React.Fragment>
    )
  }
}

FilterHeader.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  localities: PropTypes.arrayOf(PropTypes.object),
  actions: PropTypes.arrayOf(PropTypes.object),
  style: PropTypes.object,
  valState: PropTypes.arrayOf(PropTypes.object),
  valMuni: PropTypes.arrayOf(PropTypes.object),
  valMarg: PropTypes.arrayOf(PropTypes.object),
  valNumActions: PropTypes.arrayOf(PropTypes.object),
  valSector: PropTypes.arrayOf(PropTypes.object),
  valActionType: PropTypes.arrayOf(PropTypes.object),
}

export default withRouter(FilterHeader)
