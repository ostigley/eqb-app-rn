import React, { Component } from 'react';
import { Image, Text, View, Dimensions } from 'react-native';
import Orientation from 'react-native-orientation'

const Final = ({ finalImage }) => {
  Orientation.lockToPortrait()


  const width = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width
  const height = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').width : Dimensions.get('window').height

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

  return (
    <View style={ styles.container}>
      <Image
        style={ styles.image }
        source={ { uri: finalImage } }
        resizeMode={ 'contain' } />
    </View>)
}

export default Final


