import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
}                           from 'react-native';
import Orientation          from 'react-native-orientation'
import Canvas               from './canvas'

export default class Game extends Component {

  render() {
    return (
      <View >
        <Canvas />
      </View>
    )
  }
}