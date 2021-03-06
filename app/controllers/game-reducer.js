const gameReducer = (state = {}, action) => {
  let newState = Object.assign({}, state)

  switch (action.type) {
    case 'SET_STATE':
      return Object.assign(newState,action.state)
    case 'SET_DIMENSIONS':
      newState.dimensions = action.dimensions
      return newState
    case 'DRAWING_COMPLETE':
      newState.level = 'drawing complete'
      return newState
    default:
    return state
  }
}

export default gameReducer

