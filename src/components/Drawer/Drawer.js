import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import * as Actions from 'src/actions'
import Styles from './Drawer.css'


const Drawer = (props) => {
  const {
    classNameIcon,
    classNameDrawer,
    classNameWrapper,
    onToggleVisible,
    visible,
    children,
  } = props

  const show = () => {
    onToggleVisible(true)
  }

  const hide = () => {
    onToggleVisible(false)
  }

  const hamburger = <div onClick={show} className={`${Styles.hamburger} ${classNameIcon} ${classNameWrapper}`} />

  if (!visible) return hamburger
  return (
    <React.Fragment>
      {hamburger}
      <div className={`${Styles.drawer} ${classNameDrawer} ${classNameWrapper}`}>
        <span onClick={hide} className={Styles.hide} />
        <div className={Styles.children}>
          {children}
        </div>
      </div>
      <div className={Styles.drawerOverlay} onClick={hide} />
    </React.Fragment>
  )
}

Drawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onToggleVisible: PropTypes.func.isRequired,
  classNameDrawer: PropTypes.string,
  classNameIcon: PropTypes.string,
  classNameWrapper: PropTypes.string,
  children: PropTypes.any,
}

const mapStateToProps = (state) => {
  return { visible: state.drawer.visible }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleVisible: visible => Actions.drawerToggle(dispatch, { visible }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)
