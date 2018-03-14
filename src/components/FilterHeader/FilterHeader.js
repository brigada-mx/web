import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import Select from 'react-select'
import '!style-loader!css-loader!react-select/dist/react-select.css'

import MultiSelect from 'components/MultiSelect'
import { projectTypeByValue } from 'src/choices'
import Styles from './FilterHeader.css'


const margValuesAndLabels = [
  { value: 'muy_alto', label: 'Muy alto' },
  { value: 'alto', label: 'Alto' },
  { value: 'medio', label: 'Medio' },
  { value: 'bajo', label: 'Bajo' },
  { value: 'muy_bajo', label: 'Muy bajo' },
]

class FilterHeader extends React.Component {
  componentWillUpdate(nextProps) {
    const { valState, valMuni, onStateChange, onMuniChange } = this.props
    if (valState.length === 0 && nextProps.valState.length > 0
      && valMuni.length > 0) onMuniChange([])
    if (valMuni.length === 0 && nextProps.valMuni.length > 0
      && valState.length > 0) onStateChange([])
  }

  render() {
    const {
      onStateChange,
      onMuniChange,
      onMargChange,
      onNumActionsChange,
      onSectorChange,
      onActionTypeChange,
      localities,
      actions,
      valState,
      valMuni,
      valMarg,
      valNumActions,
      valSector,
      valActionType,
      style = {},
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
          <MultiSelect
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
            onChange={onStateChange}
            options={stateOptions()}
          />

          <MultiSelect
            multi
            noResultsText="Cero resultados"
            clearable={false}
            closeOnSelect={false}
            removeSelected={false}
            className={`${Styles.filter} ${Styles.muniFilter}`}
            value={valMuni}
            placeholder="Municipio"
            multiLabel="Municipio"
            onChange={onMuniChange}
            options={muniOptions()}
          />

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
            onChange={onMargChange}
            options={margValuesAndLabels}
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
            onChange={onNumActionsChange}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1-9' },
              { value: '2', label: '10-49' },
              { value: '3', label: '50+' },
            ]}
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
            onChange={onSectorChange}
            options={[
              { value: 'civil', label: 'Civil' },
              { value: 'public', label: 'Público' },
              { value: 'private', label: 'Privado' },
              { value: 'religious', label: 'Religioso' },
            ]}
          />}

          {(valActionType && actions) && <MultiSelect
            multi
            noResultsText="Cero resultados"
            clearable={false}
            closeOnSelect={false}
            removeSelected={false}
            className={`${Styles.filter} ${Styles.typeFilter}`}
            value={valActionType}
            placeholder="Tipo de proyecto"
            multiLabel="Tipo"
            onChange={onActionTypeChange}
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
                onChange={onMargChange}
                options={margValuesAndLabels}
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
                onChange={onNumActionsChange}
                options={[
                  { value: '0', label: '0' },
                  { value: '1', label: '1-9' },
                  { value: '2', label: '10-49' },
                  { value: '3', label: '50+' },
                ]}
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
                onChange={onSectorChange}
                options={[
                  { value: 'civil', label: 'Civil' },
                  { value: 'public', label: 'Público' },
                  { value: 'private', label: 'Privado' },
                  { value: 'religious', label: 'Religioso' },
                ]}
              />
            </React.Fragment>
          }
          {(valActionType && actions) &&
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
                onChange={onActionTypeChange}
                options={actionTypeOptions()}
              />
            </React.Fragment>
          }
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
            onChange={onStateChange}
            options={stateOptions()}
          />
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
            onChange={onMuniChange}
            options={muniOptions()}
          />
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
  onStateChange: PropTypes.func.isRequired,
  onMuniChange: PropTypes.func.isRequired,
  onMargChange: PropTypes.func,
  onNumActionsChange: PropTypes.func,
  onSectorChange: PropTypes.func,
  onActionTypeChange: PropTypes.func,
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.arrayOf(PropTypes.object),
  valState: PropTypes.arrayOf(PropTypes.any),
  valMuni: PropTypes.arrayOf(PropTypes.any),
  valMarg: PropTypes.arrayOf(PropTypes.any),
  valNumActions: PropTypes.arrayOf(PropTypes.any),
  valSector: PropTypes.arrayOf(PropTypes.any),
  valActionType: PropTypes.arrayOf(PropTypes.any),
  style: PropTypes.object,
}

export default FilterHeader
