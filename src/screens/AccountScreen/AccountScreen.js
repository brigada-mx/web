import React from 'react'

import { localStorage } from 'tools/storage'
import LoginScreen from './LoginScreen'
import AccountScreenWrapper from './AccountScreenWrapper'


const AccountScreen = () => {
  const { token } = JSON.parse(localStorage.getItem('719s:user')) || {}
  if (!token) return <LoginScreen />
  return <AccountScreenWrapper />
}

export default AccountScreen
