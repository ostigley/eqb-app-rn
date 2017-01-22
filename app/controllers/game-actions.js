import { gameStateSchema } from  '../models/game-state-store'

export const setState = state => {
  return {
    type: 'SET_STATE',
    state: state
  }
}

export const setDimensions = (state, dimensions) => {
  return {
    type: 'SET_DIMENSIONS',
    state: state,
    dimensions: dimensions
  }
}

export const drawingComplete = state => {
  return {
    type: 'DRAWING_COMPLETE',
    state: state
  }
}

export const resetGame = store => store.dispatch(setState(gameStateSchema))
