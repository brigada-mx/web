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
