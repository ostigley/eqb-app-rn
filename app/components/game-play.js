import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
}                           from 'react-native';
import Orientation          from 'react-native-orientation'
import Canvas               from './canvas'
// what's going on here? https://medium.com/@ekryski/how-to-actually-use-socket-io-in-react-native-39082d8d6172#.tksgjt65y
window.navigator.userAgent = 'ReactNative'
const io = require('socket.io-client/socket.io')

export default class Game extends Component {
  constructor (props) {
    super(props)
    const options = {
      transports: ['websocket'],
      forceNew: true
    }

    this.socket = io('http://localhost:3000', options)

    this.socket.on('connect', () => {
      console.log('connected to socket server')
    })

    this.socket.on('state', state => console.log(state))
  }

  render() {
    return (
      <View >
        <Canvas />
      </View>
    )
  }
}