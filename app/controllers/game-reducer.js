const gameReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_STATE':
      return action.state
    case 'SET_DIMENSIONS':
      state.dimensions = { height: action.dimensions.width, width: action.dimensions.height }
      return state
    default:
    return state
  }
}

export default gameReducer

