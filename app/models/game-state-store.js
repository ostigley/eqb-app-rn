import { createStore } from 'redux'
import gameReducer from '../controllers/game-reducer'

const store = createStore(gameReducer)
export default store