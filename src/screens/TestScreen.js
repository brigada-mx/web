import React from 'react'

import OrganizationListItem from 'components/OrganizationListItem'


const TestScreen = () => {
  const props = {
    organization: {
      name: 'cat',
      state_name: 'hello',
      action_count: 10,
    },
  }

  return <OrganizationListItem {...props} />
}

export default TestScreen
