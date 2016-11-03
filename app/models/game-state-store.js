import { createStore } from 'redux'
import gameReducer from '../controllers/game-reducer'

const store = createStore(gameReducer)

const gameStateSchema =  {
    level: 'waiting',
    body: 'waiting',
  }

export { store, gameStateSchema }
