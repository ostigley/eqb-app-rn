import React, { Component } from 'react';
import { Image, Text, View, Dimensions } from 'react-native';
var Orientation = require('react-native').NativeModules.Orientation

const Final = ({ finalImage }) => {
  Orientation.lockToPortrait()


  const {width, height} = Dimensions.get('window')
  const imageWidth = width > height ? height : width
  const imageHeight = height < width ? width : height
  console.log('final', imageWidth, imageHeight)

  const styles = {
    image: {
      flex: 1,
      width: imageWidth,
      height: imageHeight,
      borderWidth: 5,
      borderColor: 'red'
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


