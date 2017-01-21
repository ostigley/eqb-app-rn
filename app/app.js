import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  AppState,
  Dimensions }              from 'react-native'
import { GameContainer }    from './views/game-play'
import TestDimensions       from './views/test-dimensions'
import { Provider }         from 'react-redux'
import { store }            from  './models/game-state-store'
import {
  setState,
  resetGame,
  setDimensions
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

    this.socket = io('http://localhost:3000', options)

    this.socket.on('connect', () => {
      console.log('connected to socket server')
       const action = {
      type: 'SET_DIMENSIONS',
      dimensions: store.getState().dimensions,
      playerId: this.socket.id
    }
    this.socket.emit('action', action)
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

    const action = {
      type: 'ADD_DRAWING',
      body: state.num,
      part: state.part,
      drawing: data
    }
    this.socket.emit('action', action)
  }

  sendDimensions (data) {
    store.dispatch(setDimensions({}, data))
    console.log('sendD method', data)
    const action = {
      type: 'SET_DIMENSIONS',
      dimensions: { height: data.width, width: data.height },
      playerId: this.socket.id
    }
    this.socket.emit('action', action)
    this.forceUpdate()
  }

  render () {
    const dimensionsReady = store.getState().dimensions;
    let setDimensions = null
    let game = null
    if (dimensionsReady) {
      game = <View style={ styles.container1 }>
        <Text style={ styles.heading }>
          HiddenDoodle
        </Text>
        <GameContainer
          sendDrawing= { this.sendDrawing.bind(this) }/>
      </View>
    } else {
      setDimensions = <View style={ styles.container2 }>
        <TestDimensions
          sendDimensions={ this.sendDimensions.bind(this) } />
      </View>
    }

    return (
      <Provider store={ store }>
        <View style={ styles.container }>
          { game }
          { setDimensions }
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
    marginTop: Dimensions.get('window').height*0.3,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container2: {
    zIndex: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  heading: {
    fontSize: 30,
    textAlign: 'center',
    color: 'black'
  }
});

