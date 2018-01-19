export async function drawerToggle(dispatch, { visible }) {
  dispatch({
    type: 'DRAWER_TOGGLE',
    payload: { visible },
  })
}
