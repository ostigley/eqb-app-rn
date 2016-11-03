import React, { Component }       from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Game                       from './components/game-play'

const App = () =>
  <View style={ styles.container }>

    <Text style={ styles.heading }>
      HiddenDoodle
    </Text>

    <Game />

  </View>

export default App

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

