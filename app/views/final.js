import React, { Component } from 'react';
import { Image, Text, View, Dimensions } from 'react-native';
import Orientation from 'react-native-orientation'

const Final = ({finalImage}) => {
  Orientation.lockToPortrait()
	return (
    <View style={ styles.container}>
      <Image
      	style={ styles.image }
      	source={ {uri: finalImage } }
      	resizeMode={'contain'} />
    </View>)
}

export default Final

var {width, height} = Dimensions.get('window')
width = width > height ? width : Dimensions.get('window').height
height = height < width ? height : Dimensions.get('window').width


const styles = {
  image: {
    flex: 1,
    height: height,
    width: width
  },
  container: {
    flex: 1
  }
}