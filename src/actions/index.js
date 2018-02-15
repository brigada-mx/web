export async function drawerToggle(dispatch, { visible }) {
  dispatch({
    type: 'DRAWER_TOGGLE',
    payload: { visible },
  })
}

export async function actionData(dispatch, { id, data }) {
  dispatch({
    type: 'ACTION_DATA',
    payload: { id, data },
  })
}

export async function filterOrganizations(dispatch, { prop, values }) {
  dispatch({
    type: 'FILTER_ORGANIZATIONS',
    payload: { prop, values },
  })
}

export async function filterLocalities(dispatch, { prop, values }) {
  dispatch({
    type: 'FILTER_LOCALITIES',
    payload: { prop, values },
  })
}
