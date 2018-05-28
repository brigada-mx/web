import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

import ActionListItem from 'components/ActionListItem'


class ActionList extends React.PureComponent {
  handleScroll = (e) => {
    this.props.onScroll(e, this.props.actions)
  }

  render() {
    const { actions, focusedId, containerStyle = '', ...rest } = this.props
    const items = _.sortBy(actions, a => -a.score).map((a) => {
      return (
        <ActionListItem
          key={a.id}
          action={a}
          {...rest}
          focused={focusedId === a.id && a.id !== undefined}
        />
      )
    })
    return <div className={containerStyle}>{items}</div>
  }
}

ActionList.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onScroll: PropTypes.func.isRequired,
  focusedId: PropTypes.number,
  containerStyle: PropTypes.string,
}

export default ActionList
