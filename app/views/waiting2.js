import { View, Text } from 'react-native'
import React from 'react'
var Orientation = require('react-native').NativeModules.Orientation

const WaitingForNextDrawing = () => {
  Orientation.lockToLandscapeLeft()
  return (<View>
    <Text style={ {marginTop: 10} } >
      Wait just a sec for the magic to happen
    </Text>
  </View>)
}

export default WaitingForNextDrawing