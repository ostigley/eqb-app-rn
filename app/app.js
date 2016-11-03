import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  AppState }                from 'react-native'
import { GameContainer }    from './views/game-play'
import { Provider }         from 'react-redux'
import {
  store,
  gameStateSchema
}                           from  './models/game-state-store'
import {
  setState,
  resetGame
}                           from './controllers/game-actions'

resetGame(store)

// what's going on here? https://medium.com/@ekryski/how-to-actually-use-socket-io-in-react-native-39082d8d6172#.tksgjt65y
window.navigator.userAgent = 'ReactNative'
const io = require('socket.io-client/socket.io')

export default class App extends Component {
  constructor () {
    super()
    const options = {
      transports: ['websocket'],
      forceNew: true
    }

    this.socket = io('http://localhost:3000', options)

    this.socket.on('connect', () => {
      console.log('connected to socket server')
    })

    this.socket.on('disconnect', () => {
      resetGame(store)
    })

    this.socket.on('state', state => store.dispatch(setState(state)))
  }

  componentDidMount () {
    AppState.addEventListener('change', () => {
      const state = AppState.currentState
      if (state === 'inactive' || state === 'background' ) {
        this.socket.disconnect()
      } else {
        this.socket.connect()
      }
    })
  }

  render () {
    return (
      <Provider store={ store }>
        <View style={ styles.container }>
          <Text style={ styles.heading }>
            HiddenDoodle
          </Text>
          <GameContainer />
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  heading: {
    fontSize: 30,
    textAlign: 'center',
    color: 'black',
    marginTop: 10
  }
});

