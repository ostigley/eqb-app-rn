import { gameStateSchema } from  '../models/game-state-store'

export const setState = (state) => {
	console.log('state received', state)
  return {
    type: 'SET_STATE',
    state: state
  }
}

export const resetGame = store => store.dispatch(setState(gameStateSchema))
