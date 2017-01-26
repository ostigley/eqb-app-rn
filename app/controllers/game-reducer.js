const gameReducer = (state = {}, action) => {
  let newState = Object.assign({}, state)
  switch (action.type) {
    case 'SET_STATE':
      return action.state
    case 'SET_DIMENSIONS':
      newState.dimensions = { height: action.dimensions.width, width: action.dimensions.height }
      return newState
    case 'DRAWING_COMPLETE':
      newState.level = 'drawing complete'
      return newState
    default:
    return state
  }
}

export default gameReducer

