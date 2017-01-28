import React, { Component } from 'react';
import { Image, Text, View, Dimensions } from 'react-native';
var Orientation = require('react-native').NativeModules.Orientation

const Final = ({ finalImage }) => {
  Orientation.lockToPortrait()


  var {width, height} = Dimensions.get('window')
  width = width > height ? height : Dimensions.get('window').height
  height = height < width ? width : Dimensions.get('window').width

  const styles = {
    image: {
      flex: 1,
      height: height,
      width: width,
      borderWidth: 20
    },
    container: {
      flex: 1
    }
  }

  return (
    <View>
      <Image
        style={ styles.image }
        source={ { uri: finalImage } }
        resizeMode={ 'contain' } />
    </View>)
}

export default Final


