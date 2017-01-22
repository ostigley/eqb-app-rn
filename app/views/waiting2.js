import { View, Text } from 'react-native'
import React from 'react'
import Orientation from 'react-native-orientation'

const WaitingForNextDrawing = () => {
  Orientation.lockToLandscapeLeft()
  return (<View>
    <Text style={ {marginTop: 10} } >
      Wait just a sec for the magic to happen
    </Text>
  </View>)
}

export default WaitingForNextDrawing