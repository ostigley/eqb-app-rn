import { View, Text } from 'react-native'
import React from 'react'
import Orientation from 'react-native-orientation'

const Waiting = () => {
  Orientation.lockToPortrait()
  return (<View>
    <Text style={ {fontSize: 30,textAlign: 'center',color: 'black'} }>
      HiddenDoodle
    </Text>
    <Text style={ {marginTop: 10} } >
      Waiting for doodlers to join
    </Text>
  </View>)
}

export default Waiting