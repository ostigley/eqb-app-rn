import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  AppState,
  Dimensions,
  NativeModules,
  StatusBar,
  PixelRatio }              from 'react-native'
import { GameContainer }    from './views/game-play'
import { Provider }         from 'react-redux'
import { store }            from  './models/game-state-store'
import {
  setState,
  resetGame,
  setDimensions,
  drawingComplete
}                           from './controllers/game-actions'


// what's going on here? https://medium.com/@ekryski/how-to-actually-use-socket-io-in-react-native-39082d8d6172#.tksgjt65y
window.navigator.userAgent = 'ReactNative'
const io = require('socket.io-client')

export default class App extends Component {
  constructor () {
    super()
    const options = {
      transports: ['websocket'],
      forceNew: true
    }

    this.socket = io('http://192.168.0.190:3000', options)

    this.socket.on('connect', () => {
      console.log('connected to socket server')
      this.sendDimensions()
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

  sendDrawing (data) {
    const state = store.getState()
    store.dispatch(drawingComplete(state))

    const action = {
      type: 'ADD_DRAWING',
      body: state.num,
      part: state.part,
      drawing: data
    }
    this.socket.emit('action', action)
  }

  sendDimensions () {
    const width = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').width : Dimensions.get('window').height
    const height = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width
    const dimensions = { width: width, height: (height - StatusBar.currentHeight) }
    store.dispatch(setDimensions(store.getState(), dimensions))
    const action = {
      type: 'SET_DIMENSIONS',
      dimensions: dimensions,
      playerId: this.socket.id
    }
    this.socket.emit('action', action)
  }

  render () {

    return (
      <Provider store={ store }>
        <View style={ styles.container }>
          <View style={ styles.container1 }>
            <GameContainer sendDrawing= { this.sendDrawing.bind(this) }/>
          </View>
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  container1: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container2: {
    zIndex: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  }
});

